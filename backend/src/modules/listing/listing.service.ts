import {
  Currency,
  ListingStatus,
  Prisma,
} from "@prisma/client";

import slugify from "slugify";

import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import { listingRepository } from "../../repositories/ListingRepository";

import {
  CreateListingDto,
  UpdateListingDto,
  ListingQueryDto,
} from "./listing.types";

import { uploadService } from "../upload/upload.service";

class ListingService {
  /**
   * Generate a unique listing slug.
   */
  private async generateSlug(
    title: string
  ): Promise<string> {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing =
        await prisma.listing.findUnique({
          where: {
            slug,
          },
        });

      if (!existing) {
        return slug;
      }

      counter++;

      slug = `${baseSlug}-${counter}`;
    }
  }

  /**
   * Create Listing
   */
  async createListing(
    sellerId: string,
    data: CreateListingDto,
    files: Express.Multer.File[] = []
  ) {
    let uploadedImages: {
      url: string;
      publicId: string;
    }[] = [];

    try {
      /**
       * Upload images first.
       */
      if (files.length > 0) {
        uploadedImages =
          await uploadService.uploadImages(files);
      }

      return await prisma.$transaction(
        async (tx) => {
          /**
           * Verify category exists.
           */
          const category =
            await tx.category.findUnique({
              where: {
                id: data.categoryId,
              },
            });

          if (!category) {
            throw new AppError(
              "Category not found",
              404
            );
          }

          /**
           * Generate unique slug.
           */
          const slug =
            await this.generateSlug(data.title);

          /**
           * Create listing.
           */
          const listing =
            await tx.listing.create({
              data: {
                sellerId,

                categoryId: data.categoryId,

                title: data.title,

                slug,

                description: data.description,

                price: new Prisma.Decimal(
                  data.price
                ),

                currency:
                  data.currency ?? Currency.NGN,

                condition: data.condition,

                faultSeverity:
                  data.faultSeverity,

                faultDescription:
                  data.faultDescription,

                location: data.location,

                state: data.state,

                city: data.city,

                isNegotiable:
  typeof data.negotiable === "string"
    ? data.negotiable === "true"
    : data.negotiable ?? true,
                status: ListingStatus.ACTIVE,

                images: {
                  create: uploadedImages.map(
                    (image, index) => ({
                      url: image.url,
                      publicId: image.publicId,
                      position: index,
                    })
                  ),
                },
              },

              include: {
                category: true,

                images: true,

                seller: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    profileImage: true,
                  },
                },
              },
            });

          return listing;
        }
      );
    } catch (error) {
      /**
       * If database creation fails after
       * Cloudinary upload, remove uploaded images.
       */
      if (uploadedImages.length > 0) {
        await uploadService.deleteImages(
          uploadedImages.map(
            (image) => image.publicId
          )
        );
      }

      throw error;
    }
  }

  /**
   * Get Listing By ID
   */
  async getListing(listingId: string) {
    const listing =
      await prisma.listing.findUnique({
        where: {
          id: listingId,
        },

        include: {
          category: true,

          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              profileImage: true,
              verificationStatus: true,
            },
          },

          images: {
            orderBy: {
              position: "asc",
            },
          },

          videos: true,

          vehicleDetail: true,

          applianceDetail: true,
        },
      });

    if (!listing || listing.deletedAt) {
      throw new AppError(
        "Listing not found",
        404
      );
    }

    return listing;
  }

  /**
   * Get Listing By Slug
   */
  async getListingBySlug(slug: string) {
    const listing =
      await prisma.listing.findFirst({
        where: {
          slug,

          deletedAt: null,

          status: ListingStatus.ACTIVE,
        },

        include: {
          category: true,

          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              profileImage: true,
              phone: true,
              verificationStatus: true,
              createdAt: true,
            },
          },

          images: {
            orderBy: {
              position: "asc",
            },
          },

          videos: true,

          vehicleDetail: true,

          applianceDetail: true,
        },
      });

    if (!listing) {
      throw new AppError(
        "Listing not found",
        404
      );
    }

    /**
     * Increment listing views.
     */
    await prisma.listing.update({
      where: {
        id: listing.id,
      },

      data: {
        views: {
          increment: 1,
        },
      },
    });

    /**
     * Get seller's other active listings.
     */
    const sellerOtherListings =
      await prisma.listing.findMany({
        where: {
          sellerId: listing.sellerId,

          status: ListingStatus.ACTIVE,

          deletedAt: null,

          NOT: {
            id: listing.id,
          },
        },

        take: 6,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          images: {
            take: 1,

            orderBy: {
              position: "asc",
            },
          },
        },
      });

    /**
     * Get related listings from same category.
     */
    const relatedListings =
      await prisma.listing.findMany({
        where: {
          categoryId: listing.categoryId,

          status: ListingStatus.ACTIVE,

          deletedAt: null,

          NOT: {
            id: listing.id,
          },
        },

        take: 8,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          images: {
            take: 1,

            orderBy: {
              position: "asc",
            },
          },

          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              verificationStatus: true,
            },
          },
        },
      });

    return {
      ...listing,

      /**
       * Reflect the incremented view count
       * immediately in the response.
       */
      views: listing.views + 1,

      sellerOtherListings,

      relatedListings,
    };
  }

  /**
   * Get Listings
   *
   * Search + Filter + Sort + Pagination
   */
  async getListings(
    query: ListingQueryDto
  ) {
    const page = Math.max(
      1,
      Number(query.page) || 1
    );

    const limit = Math.min(
      Math.max(
        1,
        Number(query.limit) || 20
      ),
      100
    );

    const skip = (page - 1) * limit;

    /**
     * Only public active listings.
     */
    const where: Prisma.ListingWhereInput = {
      deletedAt: null,

      status: ListingStatus.ACTIVE,
    };

    /**
     * Search
     */
    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          city: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          state: {
            contains: query.search,
            mode: "insensitive",
          },
        },

        {
          location: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }

    /**
     * Category filter
     */
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    /**
     * State filter
     */
    if (query.state) {
      where.state = {
        equals: query.state,
        mode: "insensitive",
      };
    }

    /**
     * City filter
     */
    if (query.city) {
      where.city = {
        equals: query.city,
        mode: "insensitive",
      };
    }

    /**
     * Condition filter
     */
    if (query.condition) {
      where.condition = query.condition;
    }

    /**
     * Fault severity filter
     */
    if (query.faultSeverity) {
      where.faultSeverity =
        query.faultSeverity;
    }

    /**
     * Price range filter
     */
    if (
      query.minPrice !== undefined ||
      query.maxPrice !== undefined
    ) {
      where.price = {
        ...(query.minPrice !== undefined && {
          gte: new Prisma.Decimal(
            query.minPrice
          ),
        }),

        ...(query.maxPrice !== undefined && {
          lte: new Prisma.Decimal(
            query.maxPrice
          ),
        }),
      };
    }

    /**
     * Sorting
     */
    let orderBy:
      Prisma.ListingOrderByWithRelationInput = {
        createdAt: "desc",
      };

    switch (query.sort) {
      case "oldest":
        orderBy = {
          createdAt: "asc",
        };
        break;

      case "price_asc":
        orderBy = {
          price: "asc",
        };
        break;

      case "price_desc":
        orderBy = {
          price: "desc",
        };
        break;

      case "most_viewed":
        orderBy = {
          views: "desc",
        };
        break;

      case "latest":
  orderBy = {
    createdAt: "desc",
  };
  break;
    }

    /**
     * Query listings and total count
     * in one transaction.
     */
    const [items, total] =
      await prisma.$transaction([
        prisma.listing.findMany({
          where,

          skip,

          take: limit,

          orderBy,

          include: {
            category: true,

            images: {
              take: 1,

              orderBy: {
                position: "asc",
              },
            },

            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                profileImage: true,
                verificationStatus: true,
              },
            },
          },
        }),

        prisma.listing.count({
          where,
        }),
      ]);

    const totalPages = Math.ceil(
      total / limit
    );

    return {
      items,

      pagination: {
        page,

        limit,

        total,

        totalPages,

        hasNext: page < totalPages,

        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get Seller Listings
   */
  async myListings(sellerId: string) {
    return prisma.listing.findMany({
      where: {
        sellerId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        category: true,

        images: {
          take: 1,

          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }

  /**
   * Update Listing
   */
  /**
 * Upload listing images for update.
 */
async uploadListingImages(
  files: Express.Multer.File[]
) {
  if (!files || files.length === 0) {
    return [];
  }

  return uploadService.uploadImages(files);
}
  
  /**
 * Update Listing
 */
async updateListing(
  listingId: string,
  sellerId: string,
  data: UpdateListingDto
) {
  const listing =
    await listingRepository.findByIdWithImages(
      listingId
    );

  if (!listing || listing.deletedAt) {
    throw new AppError(
      "Listing not found",
      404
    );
  }

  if (listing.sellerId !== sellerId) {
    throw new AppError(
      "You do not own this listing",
      403
    );
  }

  const updateData: Prisma.ListingUpdateInput =
    {};

  /**
   * Title
   */
  if (data.title) {
    updateData.title = data.title;

    updateData.slug =
      await this.generateSlug(
        data.title
      );
  }

  /**
   * Description
   */
  if (data.description !== undefined) {
    updateData.description =
      data.description;
  }

  /**
   * Category
   */
  if (data.categoryId) {
    const category =
      await prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

    if (!category) {
      throw new AppError(
        "Category not found",
        404
      );
    }

    updateData.category = {
      connect: {
        id: data.categoryId,
      },
    };
  }

  /**
   * Price
   */
  if (data.price !== undefined) {
    updateData.price =
      new Prisma.Decimal(data.price);
  }

  /**
   * Currency
   */
  if (data.currency) {
    updateData.currency = data.currency;
  }

  /**
   * Condition
   */
  if (data.condition) {
    updateData.condition = data.condition;
  }

  /**
   * Fault severity
   */
  if (data.faultSeverity) {
    updateData.faultSeverity =
      data.faultSeverity;
  }

  /**
   * Fault description
   */
  if (
    data.faultDescription !== undefined
  ) {
    updateData.faultDescription =
      data.faultDescription;
  }

  /**
   * Location
   */
  if (data.location !== undefined) {
    updateData.location = data.location;
  }

  /**
   * State
   */
  if (data.state !== undefined) {
    updateData.state = data.state;
  }

  /**
   * City
   */
  if (data.city !== undefined) {
    updateData.city = data.city;
  }

  /**
   * Negotiable
   */
  if (data.negotiable !== undefined) {
    updateData.isNegotiable =
      data.negotiable;
  }

  /**
   * Save listing update.
   */
  const updatedListing =
    await prisma.$transaction(
      async (tx) => {
        /**
         * Replace images when new images
         * were supplied.
         */
        if (data.images) {
          await tx.listingImage.deleteMany({
            where: {
              listingId,
            },
          });
        }

        return tx.listing.update({
          where: {
            id: listingId,
          },

          data: {
            ...updateData,

            ...(data.images && {
              images: {
                create: data.images.map(
                  (image, index) => ({
                    url: image.url,

                    publicId:
                      image.publicId,

                    position: index,
                  })
                ),
              },
            }),
          },

          include: {
            images: {
              orderBy: {
                position: "asc",
              },
            },

            category: true,
          },
        });
      }
    );

  /**
   * Delete old Cloudinary images only
   * after the database update succeeds.
   */
  if (data.images) {
    const oldPublicIds =
      listing.images
        .map(
          (image) => image.publicId
        )
        .filter(
          (
            id
          ): id is string =>
            id !== null
        );

    if (oldPublicIds.length > 0) {
      try {
        await uploadService.deleteImages(
          oldPublicIds
        );
      } catch (error) {
        console.error(
          "Failed to delete old Cloudinary images:",
          error
        );
      }
    }
  }

  return updatedListing;
}
  /**
   * Soft Delete Listing
   */
  async deleteListing(
    listingId: string,
    sellerId: string
  ) {
    const listing =
      await prisma.listing.findUnique({
        where: {
          id: listingId,
        },
      });

    if (!listing || listing.deletedAt) {
      throw new AppError(
        "Listing not found",
        404
      );
    }

    if (listing.sellerId !== sellerId) {
      throw new AppError(
        "You do not own this listing",
        403
      );
    }

    await prisma.listing.update({
      where: {
        id: listingId,
      },

      data: {
        deletedAt: new Date(),
      },
    });

    return {
      message:
        "Listing deleted successfully",
    };
  }
}

export const listingService =
  new ListingService();
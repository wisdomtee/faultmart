import {
  Currency,
  ListingStatus,
  Prisma,
} from "@prisma/client";
import slugify from "slugify";

import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import {
  CreateListingDto,
  UpdateListingDto,
  ListingQueryDto,
} from "./listing.types";

import { uploadService } from "../upload/upload.service";


class ListingService {
  /**
   * Generate a unique slug
   */
  private async generateSlug(title: string): Promise<string> {
    let slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    const existing = await prisma.listing.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    return slug;
  }

  /**
   * Create Listing
   */
  /**
 * Create Listing
 */
async createListing(
  sellerId: string,
  data: CreateListingDto,
  files: Express.Multer.File[] = []
) {
  // Upload images to Cloudinary BEFORE starting the database transaction
  const uploadedImages =
    files.length > 0
      ? await uploadService.uploadImages(files)
      : [];

  return prisma.$transaction(async (tx) => {
    // Check category exists
    const category = await tx.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new AppError("Category not found.", 404);
    }

    // Generate unique slug
    const slug = await this.generateSlug(data.title);

    // Create listing
    const listing = await tx.listing.create({
      data: {
        sellerId,

        categoryId: data.categoryId,

        title: data.title,

        slug,

        description: data.description,

        price: new Prisma.Decimal(data.price),

        currency: data.currency ?? Currency.NGN,

        condition: data.condition,

        faultSeverity: data.faultSeverity,

        faultDescription: data.faultDescription,

        location: data.location,

        state: data.state,

        city: data.city,

        isNegotiable: data.negotiable ?? true,

        status: ListingStatus.ACTIVE,

        images: {
          create: uploadedImages.map((image, index) => ({
            url: image.url,
            publicId: image.publicId,
            position: index,
          })),
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
  });
}

  /**
   * Get Single Listing
   */ 

  async getListing(id: string) {
  const listing = await prisma.listing.findFirst({
    where: {
      id,
      deletedAt: null,
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
    throw new AppError("Listing not found.", 404);
  }

  return listing;
}

/**
 * Get Listing By Slug
  */
async getListingBySlug(slug: string) {
  const listing = await prisma.listing.findFirst({
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
  throw new AppError("Listing not found.", 404);
}

// Increment view count
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

// Return the updated view count in the response
// Get seller's other active listings
const sellerOtherListings = await prisma.listing.findMany({
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

// Get related listings
const relatedListings = await prisma.listing.findMany({
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
      },
    },
  },
});

return {
  ...listing,
  views: listing.views + 1,
  sellerOtherListings,
  relatedListings,
};
}

  /**
   * Get All Listings
   */
  /**
 * Get All Listings (Search + Filters + Pagination)
 */
async getListings(query: ListingQueryDto) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(
  Math.max(1, Number(query.limit) || 20),
  100
);
  const skip = (page - 1) * limit;

  const where: Prisma.ListingWhereInput = {
    deletedAt: null,
    status: ListingStatus.ACTIVE,
  };

  // Search
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
    ];
  }

  // Category
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  // State
  if (query.state) {
    where.state = {
      equals: query.state,
      mode: "insensitive",
    };
  }

  // City
  if (query.city) {
    where.city = {
      equals: query.city,
      mode: "insensitive",
    };
  }

  // Condition
  if (query.condition) {
    where.condition = query.condition;
  }

  // Fault Severity
  if (query.faultSeverity) {
    where.faultSeverity = query.faultSeverity;
  }

  // Price
  if (query.minPrice || query.maxPrice) {
    where.price = {
  ...(query.minPrice && {
    gte: new Prisma.Decimal(query.minPrice),
  }),
  ...(query.maxPrice && {
    lte: new Prisma.Decimal(query.maxPrice),
  }),
};

    if (query.minPrice) {
      where.price.gte = new Prisma.Decimal(query.minPrice);
    }

    if (query.maxPrice) {
      where.price.lte = new Prisma.Decimal(query.maxPrice);
    }
  }

  // Sorting
  let orderBy: Prisma.ListingOrderByWithRelationInput = {
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
  }

  const [items, total] = await prisma.$transaction([
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

  return {
    items,

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

      hasNext: page < Math.ceil(total / limit),

      hasPrev: page > 1,
    },
  };
}

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
  async updateListing(
    listingId: string,
    sellerId: string,
    data: UpdateListingDto
  ) {
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing || listing.deletedAt) {
      throw new AppError("Listing not found.", 404);
    }

    if (listing.sellerId !== sellerId) {
      throw new AppError(
        "You do not own this listing.",
        403
      );
    }

    const updateData: Prisma.ListingUpdateInput = {};

    if (data.title) {
      updateData.title = data.title;
      updateData.slug = await this.generateSlug(data.title);
    }

    if (data.description !== undefined)
      updateData.description = data.description;

    if (data.price !== undefined)
      updateData.price = new Prisma.Decimal(data.price);

    if (data.currency)
      updateData.currency = data.currency;

    if (data.condition)
      updateData.condition = data.condition;

    if (data.faultSeverity)
      updateData.faultSeverity = data.faultSeverity;

    if (data.faultDescription !== undefined)
      updateData.faultDescription =
        data.faultDescription;

    if (data.location !== undefined)
      updateData.location = data.location;

    if (data.state !== undefined)
      updateData.state = data.state;

    if (data.city !== undefined)
      updateData.city = data.city;

    if (data.negotiable !== undefined)
      updateData.isNegotiable = data.negotiable;

    return prisma.$transaction(async (tx) => {
      if (data.images) {
        await tx.listingImage.deleteMany({
          where: {
            listingId,
          },
        });
      }

      const updated = await tx.listing.update({
  where: {
    id: listingId,
  },

  data: {
    ...updateData,

    ...(data.images && {
      images: {
        create: data.images.map((image, index) => ({
          url: image.url,
          publicId: image.publicId,
          position: index,
        })),
      },
    }),
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

return updated;
    });
  }

  /**
   * Delete Listing (Soft Delete)
   */
  /**
 * Delete Listing (Soft Delete)
 */
/**
 * Delete Listing (Soft Delete)
 */
async deleteListing(
  listingId: string,
  sellerId: string
) {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },

    include: {
      images: true,
    },
  });

  if (!listing || listing.deletedAt) {
    throw new AppError("Listing not found.", 404);
  }

  if (listing.sellerId !== sellerId) {
    throw new AppError(
      "You do not own this listing.",
      403
    );
  }

  return prisma.$transaction(async (tx) => {
    // Delete images from Cloudinary
    if (listing.images.length > 0) {
      await uploadService.deleteImages(
        listing.images
          .map((image) => image.publicId)
          .filter(
            (publicId): publicId is string => Boolean(publicId)
          )
      );
    }

    // Delete image records
    await tx.listingImage.deleteMany({
      where: {
        listingId,
      },
    });

    // Soft delete listing
    await tx.listing.update({
      where: {
        id: listingId,
      },

      data: {
        deletedAt: new Date(),
      },
    });

    return {
      message: "Listing deleted successfully.",
    };
  });
}
} // <-- This closes the ListingService class

export const listingService = new ListingService();
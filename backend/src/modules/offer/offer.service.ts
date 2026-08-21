import {
  Prisma,
  PrismaClient,
  OfferStatus,
  ListingStatus,
  OrderStatus,
} from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

import { CreateOfferDto } from "./offer.types";

class OfferService {
  /**
   * Create Offer
   */
  async createOffer(
    buyerId: string,
    data: CreateOfferDto
  ) {
    if (data.amount <= 0) {
      throw new AppError(
        "Offer amount must be greater than zero.",
        400
      );
    }

    const listing = await prisma.listing.findFirst({
      where: {
        id: data.listingId,
        deletedAt: null,
        status: ListingStatus.ACTIVE,
      },
    });

    if (!listing) {
      throw new AppError("Listing not found.", 404);
    }

    if (listing.sellerId === buyerId) {
      throw new AppError(
        "You cannot make an offer on your own listing.",
        400
      );
    }

    // Prevent duplicate pending offer
    const existingOffer = await prisma.offer.findFirst({
      where: {
        listingId: data.listingId,
        buyerId,
        status: OfferStatus.PENDING,
      },
    });

    if (existingOffer) {
      throw new AppError(
        "You already have a pending offer for this listing.",
        400
      );
    }

    return prisma.offer.create({
      data: {
        listingId: data.listingId,
        buyerId,
        sellerId: listing.sellerId,
        amount: new Prisma.Decimal(data.amount),
        message: data.message,
      },

      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
          },
        },

        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Buyer's offers
   */
  async getMyOffers(userId: string) {
    return prisma.offer.findMany({
      where: {
        buyerId: userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        listing: {
          include: {
            images: {
              take: 1,
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });
  }

  /**
   * Seller's received offers
   */
  async getReceivedOffers(userId: string) {
    return prisma.offer.findMany({
      where: {
        sellerId: userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },

        listing: {
          include: {
            images: {
              take: 1,
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });
  }

  /**
   * Accept Offer
   */
  /**
 * Accept Offer
 */
async acceptOffer(
  sellerId: string,
  offerId: string
) {
  const offer = await prisma.offer.findUnique({
    where: {
      id: offerId,
    },
  });

  if (!offer) {
    throw new AppError("Offer not found.", 404);
  }

  if (offer.sellerId !== sellerId) {
    throw new AppError(
      "Unauthorized.",
      403
    );
  }

  if (offer.status !== OfferStatus.PENDING) {
    throw new AppError(
      "Offer has already been processed.",
      400
    );
  }

  return prisma.$transaction(async (tx) => {
    // 1. Accept the selected offer
    await tx.offer.update({
      where: {
        id: offerId,
      },
      data: {
        status: OfferStatus.ACCEPTED,
      },
    });

    // 2. Reject all other pending offers
    await tx.offer.updateMany({
      where: {
        listingId: offer.listingId,
        id: {
          not: offer.id,
        },
        status: OfferStatus.PENDING,
      },
      data: {
        status: OfferStatus.REJECTED,
      },
    });

    // 3. Create the order
    const order = await tx.order.create({
      data: {
        listingId: offer.listingId,
        buyerId: offer.buyerId,
        sellerId: offer.sellerId,
        offerId: offer.id,
        amount: offer.amount,
        currency: (
  await tx.listing.findUnique({
    where: {
      id: offer.listingId,
    },
    select: {
      currency: true,
    },
  })
)!.currency,
        status: OrderStatus.PENDING,
      },
    });

    // 4. Reserve the listing
    await tx.listing.update({
      where: {
        id: offer.listingId,
      },
      data: {
        status: ListingStatus.RESERVED,
      },
    });

    return {
      message: "Offer accepted successfully.",
      order,
    };
  });
}

  /**
   * Reject Offer
   */
  async rejectOffer(
    sellerId: string,
    offerId: string
  ) {
    const offer = await prisma.offer.findUnique({
  where: {
    id: offerId,
  },
  include: {
    listing: true,
  },
});

    if (!offer) {
      throw new AppError("Offer not found.", 404);
    }

    if (offer.sellerId !== sellerId) {
      throw new AppError(
        "Unauthorized.",
        403
      );
    }

    if (offer.status !== OfferStatus.PENDING) {
      throw new AppError(
        "Offer has already been processed.",
        400
      );
    }

    return prisma.offer.update({
      where: {
        id: offerId,
      },

      data: {
        status: OfferStatus.REJECTED,
      },
    });
  }

  /**
   * Withdraw Offer
   */
  async withdrawOffer(
    buyerId: string,
    offerId: string
  ) {
    const offer = await prisma.offer.findUnique({
      where: {
        id: offerId,
      },
    });

    if (!offer) {
      throw new AppError("Offer not found.", 404);
    }

    if (offer.buyerId !== buyerId) {
      throw new AppError(
        "Unauthorized.",
        403
      );
    }

    if (offer.status !== OfferStatus.PENDING) {
      throw new AppError(
        "Only pending offers can be withdrawn.",
        400
      );
    }

    return prisma.offer.update({
      where: {
        id: offerId,
      },

      data: {
        status: OfferStatus.WITHDRAWN,
      },
    });
  }
}

export const offerService = new OfferService();
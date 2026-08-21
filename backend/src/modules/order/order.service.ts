import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";


class OrderService {


  /**
   * Create order from listing
   */
  async createOrder(
    buyerId: string,
    data: {
      listingId: string;
      offerId?: string;
      shippingAddress?: string;
    }
  ) {

    const listing = await prisma.listing.findUnique({
      where: {
        id: data.listingId,
      },
    });


    if (!listing) {
      throw new AppError(
        "Listing not found.",
        404
      );
    }


    if (listing.sellerId === buyerId) {
      throw new AppError(
        "You cannot purchase your own listing.",
        400
      );
    }


    const existingOrder =
      await prisma.order.findUnique({
        where: {
          listingId: data.listingId,
        },
      });


    if (existingOrder) {
      throw new AppError(
        "This listing already has an order.",
        400
      );
    }


    let amount = listing.price;


    if (data.offerId) {
  const offer = await prisma.offer.findUnique({
    where: {
      id: data.offerId,
    },
  });

  if (!offer) {
    throw new AppError(
      "Offer not found.",
      404
    );
  }

  if (offer.status !== "ACCEPTED") {
    throw new AppError(
      "This offer has not been accepted.",
      400
    );
  }

  if (offer.listingId !== data.listingId) {
    throw new AppError(
      "Offer does not belong to this listing.",
      400
    );
  }

  if (offer.buyerId !== buyerId) {
    throw new AppError(
      "You are not the buyer for this offer.",
      403
    );
  }

  amount = offer.amount;
}



    return prisma.order.create({

      data: {

        listingId: listing.id,

        buyerId,

        sellerId: listing.sellerId,

        offerId: data.offerId,

        amount,

        currency: listing.currency,

        shippingAddress:
          data.shippingAddress,

      },


      include: {

        listing: true,

        buyer: true,

        seller: true,

        offer: true,

      },

    });

  }





  /**
   * Get user's orders
   */
  async getMyOrders(userId: string) {

    return prisma.order.findMany({

      where: {

        OR: [
          {
            buyerId: userId,
          },
          {
            sellerId: userId,
          },
        ],

      },


      include: {
  listing: true,
  buyer: true,
  seller: true,
  delivery: true,
},


      orderBy: {
        createdAt: "desc",
      },

    });

  }





  /**
   * Get single order
   */
  async getOrderById(
    orderId: string,
    userId: string
  ) {

    const order =
      await prisma.order.findFirst({

        where: {

          id: orderId,

          OR: [
            {
              buyerId: userId,
            },
            {
              sellerId: userId,
            },
          ],

        },


        include: {
  listing: true,
  buyer: true,
  seller: true,
  delivery: true,
},

      });


    if (!order) {

      throw new AppError(
        "Order not found.",
        404
      );

    }


    return order;

  }





  /**
   * Update order status
   */
  async updateStatus(
    orderId: string,
    userId: string,
    status: any
  ) {


    const order =
      await prisma.order.findFirst({

        where: {

          id: orderId,

          sellerId: userId,

        },

      });


    if (!order) {

      throw new AppError(
        "Order not found.",
        404
      );

    }


    return prisma.order.update({

      where: {
        id: orderId,
      },


      data: {
        status,
      },

    });

  }

    /**
   * Buyer confirms that the item/service has been received.
   *
   * PATCH /api/orders/:id/confirm-receipt
   */
  async confirmReceipt(
    orderId: string,
    buyerId: string
  ) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId,
      },
      include: {
        delivery: true,
        listing: true,
        seller: true,
      },
    });

    if (!order) {
      throw new AppError(
        "Order not found.",
        404
      );
    }

    if (order.status === "DELIVERED") {
  throw new AppError(
    "This order has already been marked as received.",
    400
  );
}

if (order.status === "CANCELLED") {
  throw new AppError(
    "A cancelled order cannot be marked as received.",
    400
  );
}

if (
  order.status !== "SHIPPED" &&
  order.status !== "CONFIRMED" &&
  order.status !== "PROCESSING"
) {
  throw new AppError(
    "This order is not ready to be marked as received.",
    400
  );
}

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "DELIVERED",
        delivery: order.delivery
          ? {
              update: {
                deliveredAt: new Date(),
                status: "DELIVERED",
              },
            }
          : undefined,
      },
      include: {
        listing: true,
        buyer: true,
        seller: true,
        delivery: true,
      },
    });

    return updatedOrder;
  }




  /**
   * Cancel order
   */
  async cancelOrder(
    orderId: string,
    userId: string
  ) {


    const order =
      await prisma.order.findFirst({

        where: {

          id: orderId,

          buyerId: userId,

        },

      });


    if (!order) {

      throw new AppError(
        "Order not found.",
        404
      );

    }


    return prisma.order.update({

      where:{
        id:orderId,
      },


      data:{
        status:"CANCELLED",
      },

    });

  }

}


export const orderService =
  new OrderService();
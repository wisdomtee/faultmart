import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { OrderStatus, DeliveryStatus } from "@prisma/client";


class DeliveryService {


  /**
   * Create delivery record
   */
  async createDelivery(
    userId: string,
    data: {
      orderId: string;
      courier?: string;
      trackingCode?: string;
    }
  ) {


    const order =
      await prisma.order.findFirst({

        where: {

          id: data.orderId,

          sellerId: userId,

        },

      });



    if (!order) {

      throw new AppError(
        "Order not found.",
        404
      );

    }



    if (order.status !== OrderStatus.CONFIRMED) {
  throw new AppError(
    "Order must be confirmed before delivery.",
    400
  );
}



    const existingDelivery =
      await prisma.delivery.findUnique({

        where: {
          orderId: data.orderId,
        },

      });



    if (existingDelivery) {

      throw new AppError(
        "Delivery already exists for this order.",
        400
      );

    }



    return prisma.delivery.create({

      data: {

        orderId: order.id,

        courier: data.courier,

        trackingCode: data.trackingCode,

      },


      include: {
        order: true,
      },

    });

  }





  /**
   * Get delivery details
   */
  async getDelivery(
    orderId: string,
    userId: string
  ) {


    const delivery =
      await prisma.delivery.findFirst({

        where: {

          orderId,

          order: {

            OR: [

              {
                buyerId: userId,
              },

              {
                sellerId: userId,
              },

            ],

          },

        },


        include: {
          order: true,
        },

      });



    if (!delivery) {

      throw new AppError(
        "Delivery not found.",
        404
      );

    }



    return delivery;

  }





  /**
   * Update delivery status
   */
  async updateStatus(
    deliveryId: string,
    userId: string,
    status: DeliveryStatus
  ) {


    const delivery =
      await prisma.delivery.findFirst({

        where: {

          id: deliveryId,

          order: {

            sellerId: userId,

          },

        },

      });



    if (!delivery) {

      throw new AppError(
        "Delivery not found.",
        404
      );

    }



    const updatedDelivery =
      await prisma.delivery.update({

        where: {

          id: deliveryId,

        },


        data: {

          status,

          deliveredAt:
            status === DeliveryStatus.DELIVERED
              ? new Date()
              : null,

        },

      });



    if (status === DeliveryStatus.DELIVERED) {

      await prisma.order.update({

        where: {

          id: delivery.orderId,

        },


        data: {

          status: OrderStatus.DELIVERED,

        },

      });

    }



    return updatedDelivery;

  }


}



export const deliveryService =
  new DeliveryService();
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";


class PaymentService {


  /**
   * Create payment record
   */
  async createPayment(
    userId: string,
    data: {
      orderId: string;
      method: any;
    }
  ) {


    const order =
      await prisma.order.findFirst({
        where: {
          id: data.orderId,
          buyerId: userId,
        },
      });


    if (!order) {
      throw new AppError(
        "Order not found.",
        404
      );
    }



    const existingPayment =
      await prisma.payment.findUnique({
        where: {
          orderId: data.orderId,
        },
      });



    if (existingPayment) {
      throw new AppError(
        "Payment already exists for this order.",
        400
      );
    }



    return prisma.payment.create({

      data: {

        orderId: order.id,

        userId,

        method: data.method,

        amount: order.amount,

        currency: order.currency,

      },


      include: {
        order: true,
      },

    });

  }





  /**
   * Get payment by order
   */
  async getPayment(
    orderId: string,
    userId: string
  ) {


    const payment =
      await prisma.payment.findFirst({

        where: {

          orderId,

          userId,

        },

        include: {
          order: true,
        },

      });



    if (!payment) {

      throw new AppError(
        "Payment not found.",
        404
      );

    }


    return payment;

  }





  /**
   * Update payment status
   */
  async updatePaymentStatus(
    reference: string,
    status: any
  ) {


    const payment =
      await prisma.payment.findUnique({

        where: {
          reference,
        },

      });



    if (!payment) {

      throw new AppError(
        "Payment reference not found.",
        404
      );

    }



    const updatedPayment =
  await prisma.payment.update({

    where: {
      id: payment.id,
    },

    data: {

      status,

      paidAt:
        status === "SUCCESS"
          ? new Date()
          : null,

    },

  });



if (status === "SUCCESS") {

  await prisma.order.update({

    where: {
      id: payment.orderId,
    },

    data: {
      status: "CONFIRMED",
    },

  });

}



return updatedPayment;

  }

}


export const paymentService =
  new PaymentService();
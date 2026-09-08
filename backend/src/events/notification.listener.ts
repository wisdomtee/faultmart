import eventEmitter from "./eventEmitter";
import { AppEvent } from "./event.types";
import notificationService from "../modules/notification/notification.service";
import { NotificationType } from "@prisma/client";
import { getSocketServer } from "../socket/socket";

eventEmitter.on(
  AppEvent.OFFER_RECEIVED,
  async ({ userId, title, message, referenceId }) => {

    const notification =
      await notificationService.createNotification(
        userId,
        title,
        message,
        NotificationType.OFFER_RECEIVED,
        referenceId,
        "Offer"
      );

    getSocketServer()
      .to(`user:${userId}`)
      .emit("notification", notification);

  }
);

eventEmitter.on(
  AppEvent.MESSAGE_RECEIVED,
  async ({ userId, title, message, referenceId }) => {
    const notification =
      await notificationService.createNotification(
        userId,
        title,
        message,
        NotificationType.NEW_MESSAGE,
        referenceId,
        "Message"
      );

    getSocketServer()
      .to(`user:${userId}`)
      .emit("notification", notification);
  }
);

eventEmitter.on(
  AppEvent.ORDER_CONFIRMED,
  async ({ userId, title, message, referenceId }) => {
    await notificationService.createNotification(
      userId,
      title,
      message,
      NotificationType.ORDER_CONFIRMED,
      referenceId,
      "Order"
    );
  }
);

// Add the remaining listeners:
// DELIVERY_UPDATED
// REVIEW_CREATED
// ADMIN_ACTION
// OFFER_ACCEPTED
// OFFER_REJECTED
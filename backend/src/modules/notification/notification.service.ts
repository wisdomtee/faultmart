import { prisma } from "../../config/prisma";
import { NotificationType } from "@prisma/client";
import { AppError } from "../../utils/AppError";

class NotificationService {
  /**
   * Create notification
   */
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    referenceId?: string,
    referenceType?: string
  ) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        referenceId,
        referenceType,
      },
    });
  }

  /**
   * Get current user's notifications
   */
  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Mark one notification as read
   */
  async markAsRead(userId: string, id: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!notification) {
      throw new AppError("Notification not found.", 404);
    }

    return prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(userId: string, id: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!notification) {
      throw new AppError("Notification not found.", 404);
    }

    return prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}

export default new NotificationService();
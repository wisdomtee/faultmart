import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import notificationService from "./notification.service";

import eventEmitter from "../../events/eventEmitter";
import { AppEvent } from "../../events/event.types";

class NotificationController {
  /**
   * Get current user's notifications
   */
  getNotifications = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user!.userId;

      const notifications =
  await notificationService.getNotifications(userId);
      return successResponse(
        res,
        notifications,
        "Notifications retrieved successfully."
      );
    }
  );

  /**
   * Mark one notification as read
   */
  markAsRead = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user!.userId;

      const notification =
        await notificationService.markAsRead(
          userId,
          String(req.params.id)
        );

      return successResponse(
        res,
        notification,
        "Notification marked as read."
      );
    }
  );

  /**
   * Mark all notifications as read
   */
  markAllAsRead = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user!.userId;

      await notificationService.markAllAsRead(userId);

      return successResponse(
        res,
        null,
        "All notifications marked as read."
      );
    }
  );

  /**
   * Get unread notification count
   */
  getUnreadCount = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user!.userId;

      const count =
        await notificationService.getUnreadCount(userId);

      return successResponse(
        res,
        { unread: count },
        "Unread notification count retrieved."
      );
    }
  );

  /**
   * Delete notification
   */
  deleteNotification = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user!.userId;

      await notificationService.deleteNotification(
        userId,
        String(req.params.id)
      );

      return successResponse(
        res,
        null,
        "Notification deleted successfully."
      );
    }
  );

  /**
   * Temporary endpoint for testing Socket.io
   * Remove this endpoint after testing.
   */
  testNotification = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user!.userId;

      eventEmitter.emit(
        AppEvent.OFFER_RECEIVED,
        {
          userId,
          title: "Socket Test",
          message:
            "Congratulations! Your Socket.io integration is working.",
          referenceId: null,
        }
      );

      return successResponse(
        res,
        null,
        "Test notification emitted successfully."
      );
    }
  );
}

export default new NotificationController();
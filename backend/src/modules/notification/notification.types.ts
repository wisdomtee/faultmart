import { NotificationType } from "@prisma/client";

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: string;
  referenceType?: string;
}

export interface NotificationQueryDto {
  page?: number;
  limit?: number;
  isRead?: boolean;
}
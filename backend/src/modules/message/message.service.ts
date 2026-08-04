import { PrismaClient, Prisma, MessageType } from "@prisma/client";
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient();

class MessageService {
  /**
   * Send a message
   */
  async sendMessage(
    senderId: string,
    data: {
      conversationId: string;
      content: string;
    }
  ) {
    const participant =
      await prisma.conversationParticipant.findFirst({
        where: {
          conversationId: data.conversationId,
          userId: senderId,
        },
      });

    if (!participant) {
      throw new AppError(
        "You are not a participant in this conversation.",
        403
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId,
        type: MessageType.TEXT,
        content: data.content,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: {
        id: data.conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  }

  /**
   * Get conversation messages
   */
  async getMessages(
    conversationId: string,
    userId: string
  ) {
    const participant =
      await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId,
        },
      });

    if (!participant) {
      throw new AppError(
        "Conversation not found.",
        404
      );
    }

    return prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Mark message as read
   */
  async markAsRead(
    messageId: string,
    userId: string
  ) {
    const message =
      await prisma.message.findUnique({
        where: {
          id: messageId,
        },
      });

    if (!message) {
      throw new AppError(
        "Message not found.",
        404
      );
    }

    const participant =
      await prisma.conversationParticipant.findFirst({
        where: {
          conversationId: message.conversationId,
          userId,
        },
      });

    if (!participant) {
      throw new AppError(
        "Unauthorized.",
        403
      );
    }

    return prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Delete own message
   */
  async deleteMessage(
    messageId: string,
    userId: string
  ) {
    const message =
      await prisma.message.findUnique({
        where: {
          id: messageId,
        },
      });

    if (!message) {
      throw new AppError(
        "Message not found.",
        404
      );
    }

    if (message.senderId !== userId) {
      throw new AppError(
        "You can only delete your own messages.",
        403
      );
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return {
      success: true,
    };
  }
}

export const messageService = new MessageService();
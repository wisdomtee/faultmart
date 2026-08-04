import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateConversationDto } from "./conversation.types";

class ConversationService {
  /**
   * Create a conversation or return the existing one
   */
  async createConversation(
    buyerId: string,
    data: CreateConversationDto
  ) {
    const { listingId, sellerId } = data;

    if (buyerId === sellerId) {
      throw new AppError(
        "You cannot start a conversation with yourself.",
        400
      );
    }

    // Ensure listing exists
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing) {
      throw new AppError("Listing not found.", 404);
    }

    // Check if conversation already exists
    const existingConversation =
  await prisma.conversation.findFirst({
    where: {
      listingId,

      participants: {
        some: {
          userId: buyerId,
        },

        every: {
          userId: {
            in: [buyerId, sellerId],
          },
        },
      },
    },

    include: {
      participants: {
        include: {
          user: true,
        },
      },

      listing: true,
    },
  });

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    return prisma.conversation.create({
      data: {
        listingId,

        participants: {
          create: [
            {
              userId: buyerId,
            },
            {
              userId: sellerId,
            },
          ],
        },
      },

      include: {
        participants: {
          include: {
            user: true,
          },
        },

        listing: true,
      },
    });
  }

  /**
   * Get all conversations belonging to a user
   */
  async getMyConversations(userId: string) {
    return prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },

      include: {
        listing: true,

        participants: {
          include: {
            user: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },

          take: 1,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * Get a single conversation
   */
  async getConversation(
    conversationId: string,
    userId: string
  ) {
    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id: conversationId,

          participants: {
            some: {
              userId,
            },
          },
        },

        include: {
          listing: true,

          participants: {
            include: {
              user: true,
            },
          },

          messages: {
            orderBy: {
              createdAt: "asc",
            },

            include: {
              sender: true,
              attachments: true,
            },
          },
        },
      });

    if (!conversation) {
      throw new AppError(
        "Conversation not found.",
        404
      );
    }

    return conversation;
  }
}

export const conversationService =
  new ConversationService();
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { conversationService } from "./conversation.service";

class ConversationController {
  /**
   * POST /api/conversations
   */
  createConversation = asyncHandler(
  async (req: Request, res: Response) => {

    console.log("CREATE CONVERSATION BODY:", req.body);
    console.log("CREATE CONVERSATION USER:", req.user.userId);

    const conversation =
      await conversationService.createConversation(
        req.user.userId,
        req.body
      );

    return successResponse(
      res,
      conversation,
      "Conversation created successfully.",
      201
    );
  }
);

  /**
   * GET /api/conversations
   */
  getMyConversations = asyncHandler(
    async (req: Request, res: Response) => {
      const conversations =
        await conversationService.getMyConversations(
          req.user.userId
        );

      return successResponse(
        res,
        conversations,
        "Conversations retrieved successfully."
      );
    }
  );

  /**
   * GET /api/conversations/:id
   */
  getConversation = asyncHandler(
    async (req: Request, res: Response) => {
      const conversation =
        await conversationService.getConversation(
          String(req.params.id),
          req.user.userId
        );

      return successResponse(
        res,
        conversation,
        "Conversation retrieved successfully."
      );
    }
  );
}

export const conversationController =
  new ConversationController();
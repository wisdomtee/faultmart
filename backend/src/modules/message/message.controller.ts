import { Request, Response } from "express";
import messageService from "./message.service";
import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";


class MessageController {

    /**
     * Send message
     * POST /api/messages/:conversationId
     */
    sendMessage = asyncHandler(async (req: Request, res: Response) => {

        const userId = req.user.userId;

        const { conversationId } = req.params;

        const { content } = req.body;


        const message = await messageService.sendMessage(
            userId,
            conversationId,
            content
        );


        return successResponse(
            res,
            message,
            "Message sent successfully.",
            201
        );
    });



    /**
     * Get conversation messages
     * GET /api/messages/:conversationId
     */
    getMessages = asyncHandler(async (req: Request, res: Response) => {

        const userId = req.user.userId;

        const { conversationId } = req.params;


        const messages = await messageService.getMessages(
            userId,
            conversationId
        );


        return successResponse(
            res,
            messages,
            "Messages retrieved successfully."
        );
    });



    /**
     * Mark message as read
     * PATCH /api/messages/:messageId/read
     */
    markAsRead = asyncHandler(async (req: Request, res: Response) => {

        const userId = req.user.userId;

        const { messageId } = req.params;


        const message = await messageService.markAsRead(
            userId,
            messageId
        );


        return successResponse(
            res,
            message,
            "Message marked as read."
        );
    });



    /**
     * Delete own message
     * DELETE /api/messages/:messageId
     */
    deleteMessage = asyncHandler(async (req: Request, res: Response) => {

        const userId = req.user.userId;

        const { messageId } = req.params;


        await messageService.deleteMessage(
            userId,
            messageId
        );


        return successResponse(
            res,
            null,
            "Message deleted successfully."
        );
    });

}


export default new MessageController();
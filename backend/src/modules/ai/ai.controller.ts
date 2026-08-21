import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import { aiService } from "./ai.service";
import { ListingAssistantInput } from "./ai.types";

class AIController {
  /**
   * POST /api/ai/listing-assistant
   *
   * Generate AI assistance for a marketplace listing.
   */
  listingAssistant = asyncHandler(
    async (req: Request, res: Response) => {
      const data = req.body as ListingAssistantInput;

      const result =
        await aiService.generateListingAssistant(data);

      return successResponse(
        res,
        result,
        "AI listing assistance generated successfully."
      );
    }
  );
}

export default new AIController();

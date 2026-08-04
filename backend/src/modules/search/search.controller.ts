import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import searchService from "./search.service";

class SearchController {

  searchListings = asyncHandler(
    async (req: Request, res: Response) => {

      const result =
        await searchService.search(req.query);

      return successResponse(
        res,
        result,
        "Search completed successfully."
      );

    }
  );

}

export default new SearchController();
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import homeService from "./home.service";

class HomeController {

  getHomepage = asyncHandler(
    async (_req: Request, res: Response) => {

      const data =
        await homeService.getHomepage();

      return successResponse(
        res,
        data,
        "Homepage data retrieved successfully."
      );

    }
  );

}

export default new HomeController();
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import categoryService from "./category.service";
import { CategoryListingQuery } from "./category.types";

class CategoryController {
  /**
   * GET /api/categories
   */
  getCategories = asyncHandler(
    async (_req: Request, res: Response) => {
      const categories =
        await categoryService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    }
  );

  /**
   * GET /api/categories/:slug
   */
  getCategory = asyncHandler(
    async (req: Request, res: Response) => {
      const category =
        await categoryService.getCategoryBySlug(
          String(req.params.slug)
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    }
  );

  /**
   * GET /api/categories/:slug/listings
   */
  getCategoryListings = asyncHandler(
    async (req: Request, res: Response) => {
      const query: CategoryListingQuery = {
        page: req.query.page
          ? Number(req.query.page)
          : 1,

        limit: req.query.limit
          ? Number(req.query.limit)
          : 20,

        search: req.query.search as string,

        sort: req.query.sort as CategoryListingQuery["sort"],

        state: req.query.state as string,

        minPrice: req.query.minPrice
          ? Number(req.query.minPrice)
          : undefined,

        maxPrice: req.query.maxPrice
          ? Number(req.query.maxPrice)
          : undefined,

        condition:
          req.query.condition as CategoryListingQuery["condition"],

        faultSeverity:
          req.query
            .faultSeverity as CategoryListingQuery["faultSeverity"],
      };

      const result =
        await categoryService.getCategoryListings(
          String(req.params.slug),
          query
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
}

export default new CategoryController();
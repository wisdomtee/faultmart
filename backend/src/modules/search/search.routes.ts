import { Router } from "express";

import searchController from "./search.controller";

import { validate } from "../../middleware/validate";

import { searchSchema } from "./search.validation";

const router = Router();

router.get(
  "/",
  validate(searchSchema),
  searchController.searchListings
);

export default router;
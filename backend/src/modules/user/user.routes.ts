import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { userController } from "./user.controller";

const router = Router();

router.get("/me", authenticate, userController.getProfile);

router.patch("/me", authenticate, userController.updateProfile);

router.patch(
  "/change-password",
  authenticate,
  userController.changePassword
);

router.delete("/me", authenticate, userController.deleteAccount);

export default router;
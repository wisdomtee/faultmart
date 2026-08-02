import { Router } from "express";

import upload from "../../middleware/upload";
import { authenticate } from "../../middleware/auth.middleware";
import { uploadImages } from "./upload.controller";

console.log("UPLOAD MIDDLEWARE:", upload);

const router = Router();

router.post(
    "/",
    authenticate,
    upload.array("files", 10),
    uploadImages
);

export default router;
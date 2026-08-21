import { Request, Response, NextFunction } from "express";

import { uploadService } from "./upload.service";

/**
 * Upload listing images
 */
export const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[];

    const images = await uploadService.uploadImages(files);

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully.",
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload career CV
 */
export const uploadCV = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "CV file is required.",
      });
    }

    const result = await uploadService.uploadCV(file);

    return res.status(200).json({
      success: true,
      message: "CV uploaded successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
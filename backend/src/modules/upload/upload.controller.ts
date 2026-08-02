import { Request, Response, NextFunction } from "express";

import { uploadService } from "./upload.service";

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
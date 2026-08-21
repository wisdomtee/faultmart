import cloudinary from "../../config/cloudinary";

export class UploadService {
  /**
   * ============================================================
   * LISTING IMAGES
   * ============================================================
   */

  async uploadImages(files: Express.Multer.File[]) {
  if (!files || files.length === 0) {
    return [];
  }

  const uploads = await Promise.all(
    files.map(
      (file) =>
        new Promise<{
          url: string;
          publicId: string;
        }>((resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "faultmart/listings",
                resource_type: "image",
              },
              (error, result) => {
                if (error || !result) {
                  return reject(
                    error ||
                      new Error(
                        "Cloudinary upload failed"
                      )
                  );
                }

                const watermarkedUrl =
                  cloudinary.url(
                    result.public_id,
                    {
                      secure: true,
                      transformation: [
  {
    overlay: "text:Arial_120_bold:FaultMart",
    gravity: "center",
    opacity: 45,
    color: "white",
    angle: -25,
  },
  {
    quality: "auto",
    fetch_format: "auto",
  },
],
                    }
                  );

                console.log(
                  "WATERMARKED IMAGE URL:",
                  watermarkedUrl
                );

                resolve({
                  url: watermarkedUrl,
                  publicId: result.public_id,
                });
              }
            );

          stream.end(file.buffer);
        })
    )
  );

  return uploads;
}

  /**
   * ============================================================
   * CV UPLOAD
   * ============================================================
   */

  async uploadCV(file: Express.Multer.File) {
    if (!file) {
      throw new Error("CV file is required");
    }

    return new Promise<{
      url: string;
      publicId: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "faultmart/careers/cv",
          resource_type: "raw",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      stream.end(file.buffer);
    });
  }

  /**
   * ============================================================
   * DELETE SINGLE IMAGE
   * ============================================================
   */

  async deleteImage(publicId: string) {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  }

  /**
   * ============================================================
   * DELETE MULTIPLE IMAGES
   * ============================================================
   */

  async deleteImages(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) {
      return;
    }

    await Promise.all(
      publicIds.map((publicId) => this.deleteImage(publicId))
    );
  }
}

export const uploadService = new UploadService();
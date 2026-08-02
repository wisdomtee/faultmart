import cloudinary from "../../config/cloudinary";

export class UploadService {
  /**
   * Upload multiple images to Cloudinary
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
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "faultmart/listings",
                resource_type: "image",
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
          })
      )
    );

    return uploads;
  }

  /**
   * Delete a single image from Cloudinary
   */
  async deleteImage(publicId: string) {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  }

  /**
   * Delete multiple images from Cloudinary
   */
  async deleteImages(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) {
      return;
    }

    await Promise.all(
      publicIds.map((publicId) =>
        this.deleteImage(publicId)
      )
    );
  }
}

export const uploadService = new UploadService();
import cloudinary from "../config/cloudinary";

export const uploadImage = async (
  file: Buffer
) => {
  return new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "faultmart/listings",
        },

        (error, result) => {
          if (error) return reject(error);

          resolve(result);
        }
      )
      .end(file);
  });
};
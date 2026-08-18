import "dotenv/config";
import cloudinary from "./src/config/cloudinary";

async function test() {
  try {
    const result = await cloudinary.api.ping();

    console.log("CLOUDINARY CONNECTION SUCCESS:");
    console.log(result);
  } catch (error) {
    console.error("CLOUDINARY CONNECTION FAILED:");
    console.error(error);
  }
}

test();

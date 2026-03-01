import {v2 as cloudinary} from "cloudinary"
import fs from "fs";

const uploadOnCloud = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
  });

  try {
    const result = await cloudinary.uploader.upload(file , {resource_type:'auto'});

    // Delete the file from local storage after upload
    fs.unlinkSync(file);

    // Return both URL and public_id
    return result.secure_url;
  } catch (error) {
    console.log(error);
     throw error;
  }
};

export default uploadOnCloud;
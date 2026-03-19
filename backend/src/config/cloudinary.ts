import { v2 as cloudinary } from "cloudinary";

console.log("🛠️ Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;

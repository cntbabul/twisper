import multer from "multer";

// We'll use memory storage and then upload to Cloudinary in the controller
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

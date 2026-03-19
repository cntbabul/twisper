import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import * as videoController from "../controllers/videoController";

import { upload } from "../middleware/multer";

const router = Router();

// Video/Reels routes
router.get("/", protectRoute, videoController.getVideos);
router.post("/", protectRoute, upload.single("video"), videoController.createVideo);
router.get("/:id", protectRoute, videoController.getVideoById);
router.post("/:id/interact", protectRoute, videoController.interactVideo);

export default router;

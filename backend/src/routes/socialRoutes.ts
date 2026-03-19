import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import * as postController from "../controllers/postController";
import * as commentController from "../controllers/commentController";
import * as notificationController from "../controllers/notificationController";
import { upload } from "../middleware/multer";

const router = Router();

// Post routes
router.post("/posts", protectRoute, upload.single("image"), postController.createPost);
router.get("/posts", protectRoute, postController.getPosts);
router.get("/posts/:postId", protectRoute, postController.getPost);
router.get("/posts/user/:username", protectRoute, postController.getUserPosts);
router.post("/posts/:postId/like", protectRoute, postController.likePost);
router.delete("/posts/:postId", protectRoute, postController.deletePost);

// Comment routes
router.get("/posts/:postId/comments", protectRoute, commentController.getComments);
router.post("/posts/:postId/comments", protectRoute, commentController.createComment);
router.delete("/comments/:commentId", protectRoute, commentController.deleteComment);

// Notification routes
router.get("/notifications", protectRoute, notificationController.getNotifications);
router.delete("/notifications/:notificationId", protectRoute, notificationController.deleteNotification);

export default router;

import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getUsers, getUserProfile, followUser, updateProfile } from "../controllers/userController";

const router = Router();

router.get("/", protectRoute, getUsers)
router.get("/profile/:username", protectRoute, getUserProfile)
router.post("/follow/:targetUserId", protectRoute, followUser)
router.put("/profile", protectRoute, updateProfile)

export default router;
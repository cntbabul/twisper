import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../models/User";
import { requireAuth } from "@clerk/express";

export type AuthRequest = Request & {
    userId?: string;
    file?: Express.Multer.File;
}

export const protectRoute = [
    requireAuth(),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userId: clerkId } = getAuth(req)
            if (!clerkId) return res.status(401).json({ message: "Unauthorised - invalid token" })
            const user = await User.findOne({ clerkId })
            if (!user) return res.status(404).json({ message: "User data not found(in database)" })
            req.userId = user._id.toString()
            next()

        } catch (error) {
            console.error("Error in protected route middleware", error)
            next(error)
        }
    }
]
import { clerkClient, getAuth } from "@clerk/express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import type { NextFunction, Request, Response } from "express";


export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500)
        next(error);
    }

}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId: clerkId } = getAuth(req);
        if (!clerkId) {
            res.status(401).json({ message: "Unauthorized" })
            return
        }
        let user = await User.findOne({ clerkId })
        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkId)

            user = await User.create({
                clerkId,
                email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
                firstName: clerkUser.firstName || "",
                lastName: clerkUser.lastName || "",
                username: clerkUser.username || clerkUser.emailAddresses?.[0]?.emailAddress?.split("@")[0] || clerkId,
                avatar: clerkUser.imageUrl
            })
        }

        // Mark as synced in Clerk so the frontend stops calling this
        await clerkClient.users.updateUser(clerkId, {
            publicMetadata: {
                isSynced: true
            }
        })

        res.json(user)
    } catch (error) {
        console.error("Auth Callback Error:", error);
        res.status(500)
        next(error)
    }
}
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { clerkMiddleware } from "@clerk/express";

const PORT = process.env.PORT || 3000

//rest object
const app = express();
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//middlewares
app.use(express.json());
app.use(cors());

//clerk middleware
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
    res.send("health OK")
});

// also expose a health endpoint under the same prefix used by the client
app.get("/api/v1/health", (req, res) => {
    res.send("health OK")
});

//custom route
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/chats", chatRoutes)
app.use("/api/v1/messages", messageRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/social", socialRoutes)
app.use("/api/v1/videos", videoRoutes)



//error handler in last
app.use(errorHandler)

export default app;

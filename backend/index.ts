import "dotenv/config";
console.log("CLERK_PUBLISHABLE_KEY starts with:", process.env.CLERK_PUBLISHABLE_KEY?.substring(0, 10));
import app from "./src/app"
import { connectDB } from "./src/config/database";
import "./src/config/cloudinary";
import { createServer } from "http";
import { initializeSocket } from "./src/utils/socket";

//port
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
initializeSocket(httpServer)

//listen
connectDB().then(() => {
    httpServer.listen(PORT as number, "0.0.0.0", () => {
        console.log(
            `🚀 Twisper Server Running On Port ${PORT}`
        );
    });
}).catch((err) => {
    console.log("Database connection failed", err);
    process.exit(1);
})
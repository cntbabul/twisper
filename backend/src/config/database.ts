import mongoose from "mongoose"
import dns from "node:dns"

// dns.setServers(['8.8.8.8'])

export const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error("Please provide MONGODB_URI in the environment variables");
    }
    try {
        console.log("🔗 Attempting to connect to MongoDB...");
        await mongoose.connect(mongoURI);
        console.log(
            `✅ Connected To Mongodb Database ${mongoose.connection.host}`
        );
    } catch (error: any) {
        console.log(`❌ Mongodb Database Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        // Check if the connection is already established
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB already connected.");
            return;
        }

        // If not, attempt to connect
        if (!process.env.MONGO_URI) {
            throw new Error("MongoDB URI not provided in environment variables.");
        }
        await mongoose.connect(process.env.MONGO_URI || "");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;


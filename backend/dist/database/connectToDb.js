"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Connect to MongoDB using Mongoose
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the connection is already established
        if (mongoose_1.default.connection.readyState === 1) {
            console.log("MongoDB already connected.");
            return;
        }
        // If not, attempt to connect
        if (!process.env.MONGO_URI) {
            throw new Error("MongoDB URI not provided in environment variables.");
        }
        yield mongoose_1.default.connect(process.env.MONGO_URI || "");
    }
    catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
});
exports.default = connectDB;

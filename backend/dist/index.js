"use strict";
// import express from 'express';
// import rootRouter from "./routes/index";
// import cors from 'cors';
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
// const app = express();
// app.use(express.json());
// app.use(cors());
// // This line is used in an Express.js application to register middleware. It tells Express to use rootRouter for handling requests that start with /api/v1.
// // rootRouter → Router (Middleware/Handler)
// app.use("/api/v1", rootRouter);
// app.listen(3000, () => {
//     console.log('Server is running on port http://localhot:3000');
// });
const express_1 = __importDefault(require("express"));
const connectToDb_1 = __importDefault(require("./database/connectToDb"));
const index_1 = __importDefault(require("./routes/index"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectToDb_1.default)();
        console.log("Database connected!");
        app.use("/api/v1", index_1.default);
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit process if DB connection fails
    }
});
startServer();

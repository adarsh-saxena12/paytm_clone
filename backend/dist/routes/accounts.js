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
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const account_1 = __importDefault(require("../schemas/account"));
const mongoose_1 = __importDefault(require("mongoose"));
const history_1 = __importDefault(require("../schemas/history"));
const user_1 = __importDefault(require("../schemas/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
// endpoint to get the balance
router.get("/balance", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const account = yield account_1.default.findOne({ userId });
        res.status(200).json({ balance: account === null || account === void 0 ? void 0 : account.balance, credits: account === null || account === void 0 ? void 0 : account.credits });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}));
router.post("/transfer", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { to, amount } = req.body;
        // Ensure userId is available from authMiddleware
        if (!req.userId) {
            throw new Error("Unauthorized request");
        }
        // Get sender's account
        const sender = yield account_1.default.findOne({ userId: req.userId }).session(session);
        if (!sender) {
            throw new Error("Error fetching balance");
        }
        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }
        // Get recipient's account
        const recipient = yield account_1.default.findOne({ userId: to }).session(session);
        if (!recipient) {
            throw new Error("Invalid recipient account");
        }
        // Perform balance transfer
        yield account_1.default.updateOne({ userId: req.userId }, { $inc: { balance: -amount, credits: Math.floor(amount / 10) } }, { session });
        yield account_1.default.updateOne({ userId: to }, { $inc: { balance: amount } }, { session });
        // Record transaction in history
        yield history_1.default.create([{ senderId: req.userId, receiverId: to, amount, timestamp: new Date() }], { session });
        // Commit the transaction
        yield session.commitTransaction();
        res.json({ message: "Transfer successful" });
    }
    catch (error) {
        yield session.abortTransaction();
        res.status(400).json({ message: error.message });
    }
    finally {
        session.endSession(); // ✅ Ensure session is closed
    }
}));
router.get("/history", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        // Fetch the current user's username
        const currentUser = yield user_1.default.findById(userId).select("username firstName lastName");
        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Fetch transaction history
        const history = yield history_1.default.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        })
            .populate("senderId", "username firstName lastName")
            .populate("receiverId", "username firstName lastName")
            .sort({ timestamp: -1 }); // Sort by latest transactions
        res.json({
            transactions: history,
            currentUser: {
                userId: currentUser._id,
                username: currentUser.username,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;

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
const user_1 = __importDefault(require("../schemas/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const account_1 = __importDefault(require("../schemas/account"));
const history_1 = __importDefault(require("../schemas/history"));
const zod_1 = require("zod");
const router = express_1.default.Router();
// Set UPI PIN (First Time)
const setPinSchema = zod_1.z.object({
    upiPin: zod_1.z.string().length(6, "UPI PIN must be 6 digits."),
    confirmUpiPin: zod_1.z.string().length(6, "UPI PIN must be 6 digits."),
});
router.post("/setpin", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { upiPin, confirmUpiPin } = setPinSchema.parse(req.body);
        console.log("setpin: ", req.body);
        if (upiPin !== confirmUpiPin) {
            res.status(400).json({ error: "UPI PIN and confirmation PIN must match." });
            return;
        }
        const user = yield user_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        if (user.upiPin) {
            res.status(400).json({ error: "UPI PIN has already been set." });
            return;
        }
        yield user_1.default.updateOne({
            _id: req.userId
        }, {
            upiPin: upiPin
        });
        yield user.save();
        res.status(200).json({ message: "UPI PIN set successfully." });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors.map((err) => err.message) });
            return;
        }
        console.error("Error setting UPI PIN:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
        return;
    }
}));
router.get("/getupipin", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: Missing userId" });
            return;
        }
        const user = yield user_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!user.upiPin) {
            res.status(400).json({ error: "UPI PIN is not set" });
            return;
        }
        res.status(200).json({ upiPin: user.upiPin });
    }
    catch (error) {
        console.error("Error fetching UPI PIN:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
}));
router.post("/paymentbyupi", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        //  to -> upiId of recipient
        const { to, amount, upiPin } = req.body;
        // Ensure userId is available from authMiddleware
        if (!req.userId) {
            throw new Error("Unauthorized request");
        }
        // Get sender's account
        const sender = yield account_1.default.findOne({ userId: req.userId }).session(session);
        if (!sender) {
            throw new Error("Error fetching balance");
        }
        const currentUser = yield user_1.default.findOne({ _id: req.userId }).session(session);
        if (!currentUser)
            throw new Error("Error fetching user!");
        if (upiPin != currentUser.upiPin)
            throw new Error("UPI pin is wrong, enter correct pin.");
        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }
        // Get recipient's account
        const recipient = yield user_1.default.findOne({ upiId: to }).session(session);
        if (!recipient) {
            throw new Error("Invalid recipient account");
        }
        // Perform balance transfer
        yield account_1.default.updateOne({ userId: req.userId }, { $inc: { balance: -amount, credits: Math.floor(amount / 10) } }, { session });
        yield account_1.default.updateOne({ userId: recipient._id }, { $inc: { balance: amount } }, { session });
        // Record transaction in history
        yield history_1.default.create([{ senderId: req.userId, receiverId: recipient._id, amount, timestamp: new Date() }], { session });
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
exports.default = router;

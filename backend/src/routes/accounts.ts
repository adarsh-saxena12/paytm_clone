import express, { Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import Account from "../schemas/account";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import History from "../schemas/history";
import User from "../schemas/user";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

interface balanceRequest extends Request {
    userId?: string
}

// endpoint to get the balance
router.get("/balance", authMiddleware, async (req: Request, res: Response) => {
    
    try {
        const userId = (req as any).userId;

        const account = await Account.findOne({ userId });
        res.status(200).json({ balance: account?.balance, credits:account?.credits });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

interface TransferRequest extends Request {
    userId?: string;
}

router.post("/transfer", authMiddleware, async (req: TransferRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { to, amount } = req.body;

        // Ensure userId is available from authMiddleware
        if (!req.userId) {
            throw new Error("Unauthorized request");
        }
       
        // Get sender's account
        const sender = await Account.findOne({ userId: req.userId }).session(session);
        if (!sender) {
            throw new Error("Error fetching balance");
        }

        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }

        // Get recipient's account
        const recipient = await Account.findOne({ userId: to }).session(session);
        if (!recipient) {
            throw new Error("Invalid recipient account");
        }

        // Perform balance transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount, credits: Math.floor(amount / 10) } }, { session });
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }, { session });
        
        // Record transaction in history
        await History.create([{ senderId: req.userId, receiverId: to, amount, timestamp: new Date() }], { session });
        
        // Commit the transaction
        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error: any) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession(); // ✅ Ensure session is closed
    }
});


//Get Transaction History (Sent & Received)
interface HistoryRequest extends Request {
    userId?: string;
}

router.get("/history", authMiddleware, async (req: HistoryRequest, res: Response) => {
    
    try {
        const userId = req.userId;

        if (!userId) {
             res.status(401).json({ message: "Unauthorized" });
             return
        }

        // Fetch the current user's username
        const currentUser = await User.findById(userId).select("username firstName lastName");
        if (!currentUser) {
             res.status(404).json({ message: "User not found" });
             return
        }

        // Fetch transaction history
        const history = await History.find({
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

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
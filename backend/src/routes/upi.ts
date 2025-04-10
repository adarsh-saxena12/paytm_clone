import express, { Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import User from "../schemas/user";
import mongoose from "mongoose";
import Account from "../schemas/account";
import History from "../schemas/history";
import { z } from "zod";


const router = express.Router();

// Set UPI PIN (First Time)

const setPinSchema = z.object({
  upiPin: z.string().length(6, "UPI PIN must be 6 digits."),
  confirmUpiPin: z.string().length(6, "UPI PIN must be 6 digits."),
});
interface RequestType extends Request {
  userId?: string
}
router.post("/setpin", authMiddleware, async (req: RequestType, res: Response) => {
  try {
    const { upiPin, confirmUpiPin } = setPinSchema.parse(req.body);
    
    console.log("setpin: ", req.body);
    
    if (upiPin !== confirmUpiPin) {
       res.status(400).json({ error: "UPI PIN and confirmation PIN must match." });
       return
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return 
    }

    if (user.upiPin) {
      res.status(400).json({ error: "UPI PIN has already been set." });
      return
    }
    
    await User.updateOne({
    _id: req.userId
    },{
      upiPin: upiPin
    });
    await user.save();

    res.status(200).json({ message: "UPI PIN set successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors.map((err:any) => err.message) });
      return
    }
    console.error("Error setting UPI PIN:", error);
     res.status(500).json({ error: "Internal server error. Please try again later." });
     return
  }
});


interface RequestUser extends Request {
    userId?:string
}

router.get("/getupipin", authMiddleware, async (req: RequestUser, res: Response) => {
    try {
        const { userId } = req;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: Missing userId" });
            return
        }

        const user = await User.findById(userId);
        if (!user) {
             res.status(404).json({ message: "User not found" });
             return
        }

        if (!user.upiPin) {
             res.status(400).json({ error: "UPI PIN is not set" });
             return
        }

        res.status(200).json({ upiPin: user.upiPin });
    } catch (error) {
        console.error("Error fetching UPI PIN:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
});

interface HistoryRequest extends Request {
  userId?: string;
}


router.post("/paymentbyupi", authMiddleware, async (req: HistoryRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    //  to -> upiId of recipient
      const { to, amount, upiPin } = req.body;
      
      // Ensure userId is available from authMiddleware
      if (!req.userId) {
          throw new Error("Unauthorized request");
      }
     
      // Get sender's account
      const sender = await Account.findOne({ userId: req.userId }).session(session);
      if (!sender) {
          throw new Error("Error fetching balance");
      }
      const currentUser = await User.findOne({_id: req.userId}).session(session);
      
      if(!currentUser) throw new Error("Error fetching user!");

      if(upiPin != currentUser.upiPin) throw new Error("UPI pin is wrong, enter correct pin.")
      
      if (sender.balance < amount) {
          throw new Error("Insufficient balance");
      }

      // Get recipient's account
      const recipient = await User.findOne({ upiId: to }).session(session);
     
      if (!recipient) {
          throw new Error("Invalid recipient account");
      }
    
      // Perform balance transfer
      await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount, credits:Math.floor(amount / 10) } }, { session });
      await Account.updateOne({ userId: recipient._id }, { $inc: { balance: amount } }, { session });
      
      // Record transaction in history
      await History.create([{ senderId: req.userId, receiverId: recipient._id, amount, timestamp: new Date() }], { session });
      
      // Commit the transaction
      await session.commitTransaction();
      res.json({ message: "Transfer successful" });
  } catch (error: any) {
      await session.abortTransaction();
      res.status(400).json({ message: error.message });
  } finally {
      session.endSession(); // ✅ Ensure session is closed
  }
})

export default router;
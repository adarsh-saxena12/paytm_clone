import express, { Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import Account from "../schemas/account";

const router = express.Router();

interface RequestType extends Request {
  userId?: string;
}

router.post("/redeem", authMiddleware, async (req: RequestType, res: Response) => {
  const userId = req.userId;
  const credits = req.body.credits;
  
  try {
    const response = await Account.updateOne(
      { userId: userId }, 
      { $inc: { balance: credits, credits: -credits } }
    );
    
    console.log("response: ", response);
    
    if (response.matchedCount === 0) {
      res.status(400).json({ error: "user not found" });
      return;
    }
    
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

export default router;
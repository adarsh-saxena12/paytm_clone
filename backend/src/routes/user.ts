
import express, { Request, Response } from "express";
import zod from "zod";
import User from "../schemas/user";
import jwt from "jsonwebtoken";
import Account from "../schemas/account";
import otpGenerator from "otp-generator";
import cookieParser from "cookie-parser";
// import { createClient } from "redis";
import authMiddleware from "../middleware/authMiddleware";
import dotenv from "dotenv";
import { Redis } from '@upstash/redis'
import { log } from "console";

dotenv.config();

const router = express.Router();
router.use(cookieParser());
router.use(express.json());
// Initialize Redis client
// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });

// redisClient.connect();

const redisClient = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})


if(process.env.JWT_SECRET === undefined){
    throw new Error("Missing JWT_SECRET in config");
}

// Zod schemas
const signupSchema = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6)
});


const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

const otpVerifySchema = zod.object({
  otp: zod.string().length(6),
  sessionId: zod.string()
});
export type SignupData = {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
  };

// Utility function to store OTP in Redis with a prefix
const storeOTP = async (username:string, otp:string) => {
  await redisClient.set(`otp:${username}`, otp, {ex:300}); // 5 minutes expiry
};

// Utility function to verify OTP from Redis with the prefix
const verifyOTP = async (username:string, otp:string) => {
  const storedOtp = await redisClient.get(`otp:${username}`);

  return String(storedOtp) === otp;
};

// Utility functions to store/retrieve signup data in Redis
const storeSignupData = async (username: string, data:SignupData) => {
  await redisClient.set(`signup:${username}`, JSON.stringify(data), {ex:300});
};

const getSignupData = async (username:string) => {
  const data = await redisClient.get(`signup:${username}`);
  
  return data as SignupData;
};

const deleteSignupData = async (username:string) => {
  await redisClient.del(`signup:${username}`);
};

// Zod schema for signin
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
});


// 🚀 **1. Signup & Request OTP**
router.post("/signup", async (req:Request, res:Response) => {
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ message: "Invalid input" });
    return;
}

  const { username, firstName, lastName, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400).json({ message: "Email already taken" });
    return;
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, { 
    digits: true, 
    lowerCaseAlphabets: false, 
    upperCaseAlphabets: false, 
    specialChars: false 
   });

  // Store OTP in Redis using key 'otp:<username>'
  await storeOTP(username, otp);

  // Store full signup data in Redis using key 'signup:<username>'
  const signupData = { username, firstName, lastName, password };
  await storeSignupData(username, signupData);

  // Generate sessionId (temporary JWT) with minimal data (username only)
  const sessionId = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: "10m" });

  // Store sessionId in HTTP-Only cookie
  res.cookie("sessionId", sessionId, { httpOnly: true, secure:process.env.NODE_ENV === 'production', maxAge: 10 * 60 * 1000 });

  res.json({ message: "OTP sent for verification", sessionId });
});

// 🚀 **2. Verify OTP & Create Account**
router.post("/verify-signup", async (req:Request, res:Response) => {
  const { success } = otpVerifySchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ message: "Invalid OTP format" });
    return;
  }

  const { otp, sessionId } = req.body;

  try {
    // Decode sessionId to get username
    // @ts-ignore
    const { username } = jwt.verify(sessionId, process.env.JWT_SECRET!);
    
    // Verify OTP from Redis using key 'otp:<username>'
    const isOtpValid = await verifyOTP(username, otp);
    if (!isOtpValid) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    // Remove OTP from Redis since it's used
    await redisClient.del(`otp:${username}`);

    // Retrieve full signup data from Redis using key 'signup:<username>'
    const signupData = await getSignupData(username);
    
    if (!signupData) {
      res.status(400).json({ message: "Signup session expired" });
      return;
    }
    
    // Create new user account using stored signup data
    const user = await User.create({ 
      username: signupData.username, 
      password: signupData.password, 
      firstName: signupData.firstName,
      lastName: signupData.lastName
    });
    await Account.create({ userId: user._id, balance: 10000 });

    // Remove signup data from Redis since it's used
    await deleteSignupData(username);

    // Generate long-term authentication token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    
    
    res.status(200).json({ message: "Account created successfully", token });
  } catch (error) {
    res.status(400).json({ message: "Invalid sessionId" });
  }
});


// 🚀 **1. Signin & Request OTP**
router.post("/signin", async (req:Request, res:Response) => {
    
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }
  
    const { username, password } = req.body;
  
    // Check if user exists with given credentials
    const user = await User.findOne({ username, password });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
  
    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { 
      digits: true, 
      lowerCaseAlphabets: false, 
      upperCaseAlphabets: false, 
      specialChars: false 
  });
 
    // Store OTP in Redis
    await storeOTP(username, otp);
    // await sendOtpEmail(username, otp);
 
    // Generate sessionId (temporary JWT with minimal data)
    const sessionId = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: "10m" });
    
    // Store sessionId in HTTP-only cookie
    res.cookie("sessionId", sessionId, { httpOnly: true, secure:process.env.NODE_ENV === 'production', maxAge: 10 * 60 * 1000 });
    
    res.status(200).json({ message: "OTP sent for login", sessionId });
  });
  
  // 🚀 **2. Verify OTP & Login**
  router.post("/verify-signin", async (req:Request, res:Response) => {
   
    const { success } = otpVerifySchema.safeParse(req.body);
   
    if (!success) {
      res.status(400).json({ message: "Invalid OTP format" });
      return;
    }
  
    const { otp, sessionId } = req.body;
    
    try {
      // Decode sessionId to extract the username
    //   @ts-ignore
      const { username } = jwt.verify(sessionId, process.env.JWT_SECRET!);
  
      // Verify OTP from Redis
      const isOtpValid = await verifyOTP(username, otp);
      if (!isOtpValid) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
      }
      
      // Remove OTP from Redis (since it's used)
      await redisClient.del(`otp:${username}`);
  
      // Retrieve user from database
      const user = await User.findOne({ username });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      
      // Generate long-term authentication token (JWT)
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  
      
      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(400).json({ message: "Invalid sessionId" });
    }
  });


// 🚀 **3. Resend OTP**
router.post("/resend-otp", async (req:Request, res:Response) => {
  const { sessionId } = req.body;

  try {
    // Decode sessionId to get username
    // @ts-ignore
    const { username } = jwt.verify(sessionId, process.env.JWT_SECRET!);

    // Generate new OTP
    const otp = otpGenerator.generate(6, { digits: true, specialChars: false });

    // Update OTP in Redis using key 'otp:<username>'
    await storeOTP(username, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid sessionId" });
  }
});


// get users to send them money
router.get("/bulk", async (req:Request, res:Response) => {
  // get quer parameter from the url
  const filter = req.query.filter || "";
  const users = await User.find({
      $or: [
          { firstName: { "$regex": filter, "$options": "i" } },
          { lastName: { "$regex": filter, "$options": "i" } }
      ]
  });

  res.json({
      user:users.map(user => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
  })
})

// update user
router.put("/update", authMiddleware, async (req:Request, res:Response) => {
  const { success } = updateBody.safeParse(req.body);
  
  if(!success){
      res.status(411).json({
          message: "Error while updating information"
      })
      return
  }
  try {
    
    await User.updateOne(
       // @ts-ignore
      { _id: req.userId }, 
      { $set: { firstName: req.body.firstName, lastName:req.body.lastName,upiId:`${req.body.firstName}@paytm`} }
    );
  
  res.status(200).json({
    message: "Updated successfully"
  })
  } catch (error) {
    res.status(411).json({
      message: "Error while updating information"
  })
}
})


export default router;

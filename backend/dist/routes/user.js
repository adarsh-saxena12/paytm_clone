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
const zod_1 = __importDefault(require("zod"));
const user_1 = __importDefault(require("../schemas/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_1 = __importDefault(require("../schemas/account"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { createClient } from "redis";
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("@upstash/redis");
const console_1 = require("console");
dotenv_1.default.config();
const router = express_1.default.Router();
router.use((0, cookie_parser_1.default)());
router.use(express_1.default.json());
// Initialize Redis client
// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });
// redisClient.connect();
const redisClient = new redis_1.Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});
if (process.env.JWT_SECRET === undefined) {
    throw new Error("Missing JWT_SECRET in config");
}
// Zod schemas
const signupSchema = zod_1.default.object({
    username: zod_1.default.string().email(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    password: zod_1.default.string().min(6)
});
const updateBody = zod_1.default.object({
    password: zod_1.default.string().optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
});
const otpVerifySchema = zod_1.default.object({
    otp: zod_1.default.string().length(6),
    sessionId: zod_1.default.string()
});
// Utility function to store OTP in Redis with a prefix
const storeOTP = (username, otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.set(`otp:${username}`, otp, { ex: 300 }); // 5 minutes expiry
});
// Utility function to verify OTP from Redis with the prefix
const verifyOTP = (username, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const storedOtp = yield redisClient.get(`otp:${username}`);
    console.log("storedOtp: ", storedOtp, "otp: ", otp);
    console.log(typeof storedOtp, typeof otp);
    return String(storedOtp) === otp;
});
// Utility functions to store/retrieve signup data in Redis
const storeSignupData = (username, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.set(`signup:${username}`, JSON.stringify(data), { ex: 300 });
});
const getSignupData = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield redisClient.get(`signup:${username}`);
    (0, console_1.log)("data: ", data);
    console.log("data-type: ", typeof data);
    return data;
});
const deleteSignupData = (username) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.del(`signup:${username}`);
});
// Zod schema for signin
const signinSchema = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
// 🚀 **1. Signup & Request OTP**
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({ message: "Invalid input" });
        return;
    }
    const { username, firstName, lastName, password } = req.body;
    // Check if user already exists
    const existingUser = yield user_1.default.findOne({ username });
    if (existingUser) {
        res.status(400).json({ message: "Email already taken" });
        return;
    }
    // Generate OTP
    const otp = otp_generator_1.default.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    // Store OTP in Redis using key 'otp:<username>'
    yield storeOTP(username, otp);
    // Store full signup data in Redis using key 'signup:<username>'
    const signupData = { username, firstName, lastName, password };
    yield storeSignupData(username, signupData);
    // Generate sessionId (temporary JWT) with minimal data (username only)
    const sessionId = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET, { expiresIn: "10m" });
    // Store sessionId in HTTP-Only cookie
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 10 * 60 * 1000 });
    res.json({ message: "OTP sent for verification", sessionId });
}));
// 🚀 **2. Verify OTP & Create Account**
router.post("/verify-signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = otpVerifySchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({ message: "Invalid OTP format" });
        return;
    }
    const { otp, sessionId } = req.body;
    try {
        // Decode sessionId to get username
        // @ts-ignore
        const { username } = jsonwebtoken_1.default.verify(sessionId, process.env.JWT_SECRET);
        // Verify OTP from Redis using key 'otp:<username>'
        const isOtpValid = yield verifyOTP(username, otp);
        if (!isOtpValid) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }
        // Remove OTP from Redis since it's used
        yield redisClient.del(`otp:${username}`);
        // Retrieve full signup data from Redis using key 'signup:<username>'
        const signupData = yield getSignupData(username);
        console.log("signupData: ", signupData);
        if (!signupData) {
            res.status(400).json({ message: "Signup session expired" });
            return;
        }
        // Create new user account using stored signup data
        const user = yield user_1.default.create({
            username: signupData.username,
            password: signupData.password,
            firstName: signupData.firstName,
            lastName: signupData.lastName
        });
        yield account_1.default.create({ userId: user._id, balance: 10000 });
        // Remove signup data from Redis since it's used
        yield deleteSignupData(username);
        // Generate long-term authentication token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({ message: "Account created successfully", token });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid sessionId" });
    }
}));
// 🚀 **1. Signin & Request OTP**
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({ message: "Invalid input" });
        return;
    }
    const { username, password } = req.body;
    // Check if user exists with given credentials
    const user = yield user_1.default.findOne({ username, password });
    if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }
    // Generate a 6-digit OTP
    const otp = otp_generator_1.default.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    // Store OTP in Redis
    yield storeOTP(username, otp);
    // await sendOtpEmail(username, otp);
    // Generate sessionId (temporary JWT with minimal data)
    const sessionId = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET, { expiresIn: "10m" });
    // Store sessionId in HTTP-only cookie
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 10 * 60 * 1000 });
    res.status(200).json({ message: "OTP sent for login", sessionId });
}));
// 🚀 **2. Verify OTP & Login**
router.post("/verify-signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = otpVerifySchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({ message: "Invalid OTP format" });
        return;
    }
    const { otp, sessionId } = req.body;
    try {
        // Decode sessionId to extract the username
        //   @ts-ignore
        const { username } = jsonwebtoken_1.default.verify(sessionId, process.env.JWT_SECRET);
        // Verify OTP from Redis
        const isOtpValid = yield verifyOTP(username, otp);
        if (!isOtpValid) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }
        // Remove OTP from Redis (since it's used)
        yield redisClient.del(`otp:${username}`);
        // Retrieve user from database
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        // Generate long-term authentication token (JWT)
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Login successful", token });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid sessionId" });
    }
}));
// 🚀 **3. Resend OTP**
router.post("/resend-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.body;
    try {
        // Decode sessionId to get username
        // @ts-ignore
        const { username } = jsonwebtoken_1.default.verify(sessionId, process.env.JWT_SECRET);
        // Generate new OTP
        const otp = otp_generator_1.default.generate(6, { digits: true, specialChars: false });
        // Update OTP in Redis using key 'otp:<username>'
        yield storeOTP(username, otp);
        res.json({ message: "OTP resent successfully" });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid sessionId" });
    }
}));
// get users to send them money
router.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get quer parameter from the url
    const filter = req.query.filter || "";
    const users = yield user_1.default.find({
        $or: [
            { firstName: { "$regex": filter, "$options": "i" } },
            { lastName: { "$regex": filter, "$options": "i" } }
        ]
    });
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
}));
// update user
router.put("/update", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        });
        return;
    }
    try {
        yield user_1.default.updateOne(
        // @ts-ignore
        { _id: req.userId }, { $set: { firstName: req.body.firstName, lastName: req.body.lastName, upiId: `${req.body.firstName}@paytm` } });
        res.status(200).json({
            message: "Updated successfully"
        });
    }
    catch (error) {
        res.status(411).json({
            message: "Error while updating information"
        });
    }
}));
exports.default = router;

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
const router = express_1.default.Router();
router.post("/redeem", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const credits = req.body.credits;
    try {
        const response = yield account_1.default.updateOne({ userId: userId }, { $inc: { balance: credits, credits: -credits } });
        console.log("response: ", response);
        if (response.matchedCount === 0) {
            res.status(400).json({ error: "user not found" });
            return;
        }
        res.status(200).json({ response });
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
}));
exports.default = router;

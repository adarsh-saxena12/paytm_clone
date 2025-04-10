"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const authHeader = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    //                  0      1
    //  Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({});
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        if (!token) {
            res.status(403).json({});
            return;
        }
        if (process.env.JWT_SECRET === undefined) {
            res.status(403).json({});
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(403).json({});
        return;
    }
};
exports.default = authMiddleware;

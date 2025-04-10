"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    upiId: {
        type: String,
        unique: true
    },
    upiPin: {
        type: String
    }
});
// Auto-generate UPI ID before saving
userSchema.pre("save", function (next) {
    if (!this.upiId) {
        this.upiId = `${this.firstName}@paytm`; // Example: rahul@paytm
    }
    next();
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;

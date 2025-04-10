"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const accounts_1 = __importDefault(require("./accounts"));
const upi_1 = __importDefault(require("./upi"));
const credits_1 = __importDefault(require("./credits"));
const router = express_1.default.Router();
router.use("/user", user_1.default);
router.use("/account", accounts_1.default);
router.use("/upi", upi_1.default);
router.use("/credits", credits_1.default);
exports.default = router;

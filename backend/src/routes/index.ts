import express from 'express';
import userRouter from "./user";
import accountRouter from "./accounts"
import upiRouter from "./upi"
import creditRouter from "./credits"

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);
router.use("/upi", upiRouter);
router.use("/credits", creditRouter);

export default router;
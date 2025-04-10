import { NextFunction, Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    userId?:string
}

const authMiddleware:RequestHandler = (req: AuthenticatedRequest, res:Response, next: NextFunction) => {
   
    const authHeader = req.headers?.authorization;

    //                  0      1
    //  Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(403).json({});
         return
    }
    const token = authHeader.split(' ')[1];
    
    try {
        if (!token) {
            res.status(403).json({});
            return
        }
        
        if (process.env.JWT_SECRET === undefined) {
            res.status(403).json({});
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //@ts-ignore
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
         res.status(403).json({});
         return
    }
   
}

export default authMiddleware;
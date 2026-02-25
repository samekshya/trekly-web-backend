import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    //const authHeader = req.headers.authorization;

    //if (!authHeader || !authHeader.startsWith("Bearer ")) {
      //return res.status(401).json({
        //success: false,
        //message: "No token provided",
     // });
    //}

    //const token = authHeader.split(" ")[1];
    // 1. Try to get token from cookie first
let token = req.cookies?.token;

// 2. If no cookie, fallback to Authorization header
if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
  token = req.headers.authorization.split(' ')[1];
}

// 3. If still no token, return an error
if (!token) {
  return res.status(401).json({ message: 'Not authorized, no token provided' });
}



    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // attach decoded user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  // req.user should be set by your auth middleware (JWT)
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access only" });
  }

  next();
};

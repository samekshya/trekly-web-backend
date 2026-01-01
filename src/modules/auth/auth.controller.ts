import { Request, Response, NextFunction } from "express";
import { loginUserService, registerUserService } from "./auth.service";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerUserService(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    return res.status(result.status).json({
      success: true,
      message: "User registered successfully",
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginUserService(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    return res.status(result.status).json({
      success: true,
      message: "Login successful",
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};

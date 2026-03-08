import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateDto =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
    }

    req.body = parsed.data;
    next();
  };

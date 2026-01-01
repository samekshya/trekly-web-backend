import { Router } from "express";

const router = Router();

router.get("/test", (_req, res) => {
  res.json({ success: true, message: "Auth routes working" });
});

router.post("/register", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Register hit",
    data: req.body,
  });
});

export default router;

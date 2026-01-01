import { Router } from "express";
import { register } from "./auth.controller";

const router = Router();

router.get("/test", (_req, res) => {
  res.json({ success: true, message: "Auth routes working" });
});

router.post("/register", register);

export default router;

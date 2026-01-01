import { Router } from "express";
import { register } from "./auth.controller";

const router = Router();

router.post("/register", register);

router.get("/test", (_req, res) => {
  res.json({ success: true, message: "Auth routes working" });
});

export default router;

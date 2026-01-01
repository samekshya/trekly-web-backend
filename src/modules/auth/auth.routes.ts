import { Router } from "express";

const router = Router();

router.get("/test", (_req, res) => {
  return res.json({ success: true, message: "Auth routes working" });
});

export default router;

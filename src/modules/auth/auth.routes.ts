import { Router } from "express";
import { validateDto } from "../../middlewares/validateDto";
import { loginSchema } from "./dto/login.dto";
import { registerSchema } from "./dto/register.dto";
import { loginUser, registerUser } from "./auth.controller";

const router = Router();

router.get("/test", (_req, res) => {
  res.json({ success: true, message: "Auth routes working" });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.json({ success: true, message: "Logged out" });
});


router.post("/register", validateDto(registerSchema), registerUser);
router.post("/login", validateDto(loginSchema), loginUser);

export default router;

import { Router } from "express";
import { validateDto } from "../../middlewares/validateDto";
import { loginSchema } from "./dto/login.dto";
import { registerSchema } from "./dto/register.dto";
import { loginUser, registerUser, updateProfile } from "./auth.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { upload } from "../../config/multer";
import { getMe } from "./auth.controller";


//console.log("AUTH ROUTES LOADED - WITH /ME");


const router = Router();


router.get("/test", (_req, res) => {
  res.json({ success: true, message: "Auth routes working" });
});

router.get("/me", requireAuth, getMe);

router.post("/logout", (_req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.json({ success: true, message: "Logged out" });
});

router.post("/register", validateDto(registerSchema), registerUser);
router.post("/login", validateDto(loginSchema), loginUser);

// ✅ User profile update (logged-in user only, supports image upload)
router.put("/:id", requireAuth, upload.single("image"), updateProfile);

export default router;


// import { Router } from "express";
// import { validateDto } from "../../middlewares/validateDto";
// import { loginSchema } from "./dto/login.dto";
// import { registerSchema } from "./dto/register.dto";
// import { loginUser, registerUser } from "./auth.controller";

// const router = Router();

// router.get("/test", (_req, res) => {
//   res.json({ success: true, message: "Auth routes working" });
// });

// router.post("/logout", (_req, res) => {
//   res.clearCookie("token", { path: "/" });
//   return res.json({ success: true, message: "Logged out" });
// });


// router.post("/register", validateDto(registerSchema), registerUser);
// router.post("/login", validateDto(loginSchema), loginUser);

// export default router;

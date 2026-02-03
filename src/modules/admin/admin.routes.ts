import { Router } from "express";
import { upload } from "../../config/multer";
import { isAdmin } from "../../middlewares/isAdmin";
import { requireAuth } from "../../middlewares/requireAuth";

// TODO: Replace this with your real auth middleware import
// Example: import { requireAuth } from "../auth/auth.middleware";


import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "./admin.controller";

const router = Router();

router.post("/users", requireAuth, isAdmin, upload.single("image"), createUser);
router.get("/users", requireAuth, isAdmin, getAllUsers);
router.get("/users/:id", requireAuth, isAdmin, getUserById);
router.put("/users/:id", requireAuth, isAdmin, upload.single("image"), updateUserById);
router.delete("/users/:id", requireAuth, isAdmin, deleteUserById);

export default router;

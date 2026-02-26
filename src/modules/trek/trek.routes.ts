import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { isAdmin } from "../../middlewares/isAdmin";
import { upload } from "../../config/multer";
import {
  createTrek,
  getAllTreks,
  getTrekById,
  updateTrek,
  deleteTrek,
} from "./trek.controller";

const router = Router();

// PUBLIC routes (Flutter + Web can read treks without login)
router.get("/", getAllTreks);
router.get("/:id", getTrekById);

// ADMIN only routes (Web Admin Panel)
router.post("/", requireAuth, isAdmin, upload.single("image"), createTrek);
router.put("/:id", requireAuth, isAdmin, upload.single("image"), updateTrek);
router.delete("/:id", requireAuth, isAdmin, deleteTrek);

export default router;

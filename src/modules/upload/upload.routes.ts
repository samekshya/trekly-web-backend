import { Router } from "express";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("image"), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const imageUrl = `http://localhost:5050/uploads/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    imageUrl,
  });
});

export default router;

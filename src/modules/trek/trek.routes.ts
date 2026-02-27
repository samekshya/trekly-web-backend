// trek.routes.ts
import { Router } from "express";
import { createTrek, getAllTreks, getTrekById, updateTrek, deleteTrek } from "./trek.controller";

const router = Router();

router.post("/", createTrek);        // no upload.single(...)
router.get("/", getAllTreks);
router.get("/:id", getTrekById);
router.put("/:id", updateTrek);
router.delete("/:id", deleteTrek);

export default router;

// // src/modules/trek/trek.routes.ts
// import { Router } from "express";
// import multer from "multer";
// import {
//   createTrek,
//   getAllTreks,
//   getTrekById,
//   updateTrek,
//   deleteTrek,
// } from "./trek.controller";

// const router = Router();
// const upload = multer({ dest: "uploads/" });

// router.post("/", upload.single("image"), createTrek);
// router.get("/", getAllTreks);
// router.get("/:id", getTrekById);
// router.put("/:id", upload.single("image"), updateTrek);
// router.delete("/:id", deleteTrek);

// export default router;

import { Router } from "express";
import { createTrek, getAllTreks, getTrekById, updateTrek, deleteTrek, bookTrek } from "./trek.controller";

const router = Router();

router.post("/", createTrek);
router.get("/", getAllTreks);
router.get("/:id", getTrekById);
router.put("/:id", updateTrek);
router.delete("/:id", deleteTrek);
router.post("/:id/book", bookTrek);

export default router;
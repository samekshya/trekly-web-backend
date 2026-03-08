import { Router } from "express";
import { createReview, getReviewsByTrek, canReview } from "./review.controller";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

// Public — anyone can read reviews
router.get("/:trekId", getReviewsByTrek);

// Protected — must be logged in
router.get("/:trekId/can-review", requireAuth, canReview);
router.post("/:trekId", requireAuth, createReview);

export default router;
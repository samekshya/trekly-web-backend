import { Request, Response } from "express";
import Review from "./review.model";
import Booking from "../booking/booking.model";

// POST /api/reviews/:trekId — submit a review (must have booked)
export const createReview = async (req: any, res: Response) => {
  try {
    const { trekId } = req.params;
    const userId = req.user.id;
    const userName = req.user.name || req.user.email;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if user has booked this trek
    const booking = await Booking.findOne({
      trekId,
      $or: [
        { userId },
        { email: req.user.email },
      ],
    });

    if (!booking) {
      return res.status(403).json({
        message: "You can only review treks you have booked",
      });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ trekId, userId });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this trek" });
    }

    const review = await Review.create({
      trekId,
      userId,
      userName,
      rating: Number(rating),
      comment,
    });

    return res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    console.error("createReview error:", error.message);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// GET /api/reviews/:trekId — get all reviews for a trek
export const getReviewsByTrek = async (req: Request, res: Response) => {
  try {
    const { trekId } = req.params;

    const reviews = await Review.find({ trekId }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return res.status(200).json({
      success: true,
      data: reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      total: reviews.length,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// GET /api/reviews/:trekId/can-review — check if logged in user can review
export const canReview = async (req: any, res: Response) => {
  try {
    const { trekId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      trekId,
      $or: [{ userId }, { email: req.user.email }],
    });

    const alreadyReviewed = await Review.findOne({ trekId, userId });

    return res.status(200).json({
      success: true,
      canReview: !!booking && !alreadyReviewed,
      hasBooked: !!booking,
      alreadyReviewed: !!alreadyReviewed,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
import { Router } from "express";
import Booking from "../booking/booking.model";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

// GET /api/bookings — admin gets all bookings
router.get("/", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// GET /api/bookings/my — logged in user gets their own bookings
router.get("/my", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: (req as any).user.id }).sort({ createdAt: -1 });
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

export default router;
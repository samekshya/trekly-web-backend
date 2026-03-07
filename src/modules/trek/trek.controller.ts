import { Request, Response } from "express";
import Trek from "./trek.model";
import { sendBookingConfirmation } from "../../services/emailService";

export const createTrek = async (req: any, res: Response) => {
  try {
    console.log("BODY:", req.body);

    const {
      name,
      description,
      location,
      duration,
      difficulty,
      price,
      itinerary,
      hotels,
      imageUrl,          // <-- add this
    } = req.body;

    const newTrek = await Trek.create({
      name,
      description,
      location,
      duration: Number(duration),
      difficulty,
      imageUrl,          // <-- use JSON field
      price: price ? Number(price) : undefined,
      itinerary:
        typeof itinerary === "string" && itinerary.trim() !== ""
          ? JSON.parse(itinerary)
          : undefined,
      hotels:
        typeof hotels === "string" && hotels.trim() !== ""
          ? JSON.parse(hotels)
          : undefined,
    });

    return res.status(201).json({ success: true, data: newTrek });
  } catch (error: any) {
    console.error("createTrek error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// export const createTrek = async (req: any, res: Response) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);

//     const {
//       name,
//       description,
//       location,
//       duration,
//       difficulty,
//       price,
//       itinerary,
//       hotels,
//     } = req.body;

//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

//     const newTrek = await Trek.create({
//       name,
//       description,
//       location,
//       duration: Number(duration),
//       difficulty,
//       imageUrl,
//       price: price ? Number(price) : undefined,
//       itinerary:
//         typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary,
//       hotels: typeof hotels === "string" ? JSON.parse(hotels) : hotels,
//     });

//     return res.status(201).json({ success: true, data: newTrek });
//   } catch (error: any) {
//     console.error("createTrek error:", error.message);
//     return res
//       .status(500)
//       .json({ success: false, message: error.message || "Server error" });
//   }
// };

export const getAllTreks = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const [treks, total] = await Promise.all([
      Trek.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Trek.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: treks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("getAllTreks error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const getTrekById = async (req: Request, res: Response) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek)
      return res
        .status(404)
        .json({ success: false, message: "Trek not found" });
    return res.status(200).json({ success: true, data: trek });
  } catch (error: any) {
    console.error("getTrekById error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const updateTrek = async (req: any, res: Response) => {
  try {
    const {
      name,
      description,
      location,
      duration,
      difficulty,
      price,
      itinerary,
      hotels,
    } = req.body;

    const updateData: any = {
      name,
      description,
      location,
      difficulty,
    };

    if (duration) updateData.duration = Number(duration);
    if (price) updateData.price = Number(price);
    if (typeof itinerary === "string")
      updateData.itinerary = JSON.parse(itinerary);
    if (typeof hotels === "string") updateData.hotels = JSON.parse(hotels);
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const trek = await Trek.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!trek)
      return res
        .status(404)
        .json({ success: false, message: "Trek not found" });

    return res.status(200).json({ success: true, data: trek });
  } catch (error: any) {
    console.error("updateTrek error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const deleteTrek = async (req: Request, res: Response) => {
  try {
    const trek = await Trek.findByIdAndDelete(req.params.id);
    if (!trek)
      return res
        .status(404)
        .json({ success: false, message: "Trek not found" });
    return res
      .status(200)
      .json({ success: true, message: "Trek deleted successfully" });
  } catch (error: any) {
    console.error("deleteTrek error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};



export const bookTrek = async (req: Request, res: Response) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: "Trek not found" });

    const { name, email, phone, date, people, notes } = req.body;

    if (!name || !email || !phone || !date || !people) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    await sendBookingConfirmation({
      toEmail: email,
      toName: name,
      trekName: trek.name,
      trekLocation: trek.location,
      date,
      people: parseInt(people),
      totalPrice: trek.price * parseInt(people),
    });

    return res.status(200).json({ success: true, message: "Booking confirmed and email sent!" });
  } catch (error: any) {
    console.error("bookTrek error:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};


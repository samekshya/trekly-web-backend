import { Request, Response } from "express";
import Trek from "./trek.model";

export const createTrek = async (req: any, res: Response) => {
  try {
    const trek = await Trek.create(req.body);
    return res.status(201).json({ success: true, data: trek });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTreks = async (req: Request, res: Response) => {
  try {
    const treks = await Trek.find();
    return res.status(200).json({ success: true, data: treks });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrekById = async (req: Request, res: Response) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: "Trek not found" });
    return res.status(200).json({ success: true, data: trek });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTrek = async (req: any, res: Response) => {
  try {
    const trek = await Trek.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trek) return res.status(404).json({ success: false, message: "Trek not found" });
    return res.status(200).json({ success: true, data: trek });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTrek = async (req: Request, res: Response) => {
  try {
    const trek = await Trek.findByIdAndDelete(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: "Trek not found" });
    return res.status(200).json({ success: true, message: "Trek deleted" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// import { Request, Response } from "express";
// import Trek from "./trek.model";

// export const createTrek = async (req: any, res: Response) => {
//   try {
//     const { title, description, price, difficulty, duration, location, itinerary, hotels, category } = req.body;
    
//     const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    
//     const trek = await Trek.create({
//       title, description, price, difficulty,
//       duration, location, category,
//       image,
//       // Parse JSON strings from form data if sent as strings
//       itinerary: typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary,
//       hotels: typeof hotels === "string" ? JSON.parse(hotels) : hotels,
//     });

//     return res.status(201).json({ success: true, data: trek });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getAllTreks = async (req: Request, res: Response) => {
//   try {
//     const page = Math.max(parseInt(req.query.page as string) || 1, 1);
//     const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
//     const skip = (page - 1) * limit;
    
//     // Filter by difficulty (Flutter's "Easy / Medium / Hard" filter buttons)
//     const filter: any = {};
//     if (req.query.difficulty) filter.difficulty = req.query.difficulty;
//     if (req.query.search) {
//       filter.$or = [
//         { title: { $regex: req.query.search, $options: "i" } },
//         { location: { $regex: req.query.search, $options: "i" } },
//       ];
//     }

//     const [treks, total] = await Promise.all([
//       Trek.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
//       Trek.countDocuments(filter),
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: treks,
//       pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
//     });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getTrekById = async (req: Request, res: Response) => {
//   try {
//     const trek = await Trek.findById(req.params.id);
//     if (!trek) return res.status(404).json({ success: false, message: "Trek not found" });
//     return res.status(200).json({ success: true, data: trek });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updateTrek = async (req: any, res: Response) => {
//   try {
//     const updateData: any = { ...req.body };
//     if (req.file) updateData.image = `/uploads/${req.file.filename}`;
//     if (typeof updateData.itinerary === "string") updateData.itinerary = JSON.parse(updateData.itinerary);
//     if (typeof updateData.hotels === "string") updateData.hotels = JSON.parse(updateData.hotels);

//     const trek = await Trek.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!trek) return res.status(404).json({ success: false, message: "Trek not found" });
//     return res.status(200).json({ success: true, data: trek });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const deleteTrek = async (req: Request, res: Response) => {
//   try {
//     const trek = await Trek.findByIdAndDelete(req.params.id);
//     if (!trek) return res.status(404).json({ success: false, message: "Trek not found" });
//     return res.status(200).json({ success: true, message: "Trek deleted" });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

import { Response } from "express";
import Favourite from "./favourites.model";

// Add to favourites
export const addFavourite = async (req: any, res: Response) => {
  try {
    const { trekId } = req.body;
    const userId = req.user._id;

    const existing = await Favourite.findOne({ user: userId, trek: trekId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already in favourites" });
    }

    const favourite = await Favourite.create({ user: userId, trek: trekId });
    return res.status(201).json({ success: true, data: favourite });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all favourites for logged in user
export const getFavourites = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const favourites = await Favourite.find({ user: userId }).populate("trek");
    return res.status(200).json({ success: true, data: favourites });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from favourites
export const removeFavourite = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { trekId } = req.params;

    const favourite = await Favourite.findOneAndDelete({ user: userId, trek: trekId });
    if (!favourite) {
      return res.status(404).json({ success: false, message: "Favourite not found" });
    }

    return res.status(200).json({ success: true, message: "Removed from favourites" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check if a trek is favourited
export const checkFavourite = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { trekId } = req.params;

    const favourite = await Favourite.findOne({ user: userId, trek: trekId });
    return res.status(200).json({ success: true, isFavourited: !!favourite });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
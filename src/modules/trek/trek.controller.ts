import { Request, Response } from "express";
import Trek from "./trek.model";

export const createTrek = async (req: Request, res: Response) => {
  try {
    const trek = await Trek.create(req.body);
    res.status(201).json({ success: true, data: trek });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTreks = async (req: Request, res: Response) => {
  try {
    const treks = await Trek.find();
    res.status(200).json({ success: true, data: treks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTrek = async (req: Request, res: Response) => {
  try {
    await Trek.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Trek deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "createUser (todo)" });
};

export const getAllUsers = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "getAllUsers (todo)" });
};

export const getUserById = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "getUserById (todo)",
    id: req.params.id,
  });
};

export const updateUserById = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "updateUserById (todo)",
    id: req.params.id,
  });
};

export const deleteUserById = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "deleteUserById (todo)",
    id: req.params.id,
  });
};

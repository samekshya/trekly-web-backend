import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../user/user.model";

export const createUser = async (req: any, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // image handling
    let image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      image,
    });

    // remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      data: userObj,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//import { Request, Response } from "express";

// export const createUser = async (req: Request, res: Response) => {
//   return res.status(200).json({ success: true, message: "createUser (todo)" });
// };

// export const getAllUsers = async (req: Request, res: Response) => {
//   return res.status(200).json({ success: true, message: "getAllUsers (todo)" });
// };

// export const getUserById = async (req: Request, res: Response) => {
//   return res.status(200).json({
//     success: true,
//     message: "getUserById (todo)",
//     id: req.params.id,
//   });
// };

// export const updateUserById = async (req: Request, res: Response) => {
//   return res.status(200).json({
//     success: true,
//     message: "updateUserById (todo)",
//     id: req.params.id,
//   });
// };

// export const deleteUserById = async (req: Request, res: Response) => {
//   return res.status(200).json({
//     success: true,
//     message: "deleteUserById (todo)",
//     id: req.params.id,
//   });
// };

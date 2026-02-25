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



export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const skip = (page - 1) * limit;

    const search = (req.query.search as string)?.trim();
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};



export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserById = async (req: any, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
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

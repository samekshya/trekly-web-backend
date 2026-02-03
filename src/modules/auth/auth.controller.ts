import { Request, Response, NextFunction } from "express";
import { loginUserService, registerUserService } from "./auth.service";
import User from "../user/user.model";
import bcrypt from "bcryptjs";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUserService(req.body);

    if (!result.ok) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginUserService(req.body);

    if (!result.ok) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    const token = result.data.token;

    // ✅ SET COOKIE HERE (THIS IS THE IMPORTANT PART)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // localhost only
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
  success: true,
  message: "Login successful",
  data: {
    token,            // ✅ add this
    user: result.data.user,
  },
});

  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userIdFromToken = req.user?.id;
    const userIdFromParam = req.params.id;

    if (!userIdFromToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (userIdFromToken !== userIdFromParam) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    const updateData: any = {};
    const { name, email, password } = req.body;

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userIdFromParam, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: any, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = await User.findById(userId).select("-password");

  return res.status(200).json({
    success: true,
    data: user,
  });
};


// import { Request, Response, NextFunction } from "express";
// import { loginUserService, registerUserService } from "./auth.service";

// export const registerUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const result = await registerUserService(req.body);

//     if (!result.ok) {
//       return res
//         .status(result.status)
//         .json({ success: false, message: result.message });
//     }

//     // OPTIONAL: only set cookie if token exists (safe, does nothing otherwise)
//     if ((result as any).data?.token) {
//       res.cookie("token", (result as any).data.token, {
//         httpOnly: true,
//         sameSite: "lax",
//         secure: false,
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });
//     }

//     return res.status(result.status).json({
//       success: true,
//       message: "User registered successfully",
//       data: result.data,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const loginUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const result = await loginUserService(req.body);

//     if (!result.ok) {
//       return res
//         .status(result.status)
//         .json({ success: false, message: result.message });
//     }

//     // ✅ REQUIRED FOR SPRINT: save JWT in cookie
//     res.cookie("token", result.data.token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false, // set true only in production (HTTPS)
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     return res.status(result.status).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         user: result.data.user,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // import { Request, Response, NextFunction } from "express";
// // import { loginUserService, registerUserService } from "./auth.service";

// // export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
// //   try {
// //     const result = await registerUserService(req.body);

// //     if (!result.ok) {
// //       return res.status(result.status).json({ success: false, message: result.message });
// //     }

// //     return res.status(result.status).json({
// //       success: true,
// //       message: "User registered successfully",
// //       data: result.data,
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
// //   try {
// //     const result = await loginUserService(req.body);

// //     if (!result.ok) {
// //       return res.status(result.status).json({ success: false, message: result.message });
// //     }
// //     // set token in cookie
// //   res.cookie("token", result.data.token, {
// //   httpOnly: true,
// //   sameSite: "lax",
// //   secure: false, // true only in HTTPS
// //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// //   });

// //   return res.status(result.status).json({
// //   success: true,
// //   message: "Login successful",
// //   data: {
// //     user: result.data.user,
// //   },
// // });

// //     // return res.status(result.status).json({
// //     //   success: true,
// //     //   message: "Login successful",
// //     //   data: result.data,
// //     // });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

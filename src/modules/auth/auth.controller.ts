import { Request, Response, NextFunction } from "express";
import { loginUserService, registerUserService } from "./auth.service";

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
      data: result.data.user,
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

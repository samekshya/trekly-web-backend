import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  image?: string; // ✅ added
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    image: {
      type: String,
    }, //reset password ko line 
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role: "user" | "admin";
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema: Schema<IUser> = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 2,
//       maxlength: 50,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//       select: false,
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//   },
//   { timestamps: true }
// );

// const User: Model<IUser> =
//   mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// export default User;

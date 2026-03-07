import mongoose, { Schema, Document } from "mongoose";

export interface IFavourite extends Document {
  user: mongoose.Types.ObjectId;
  trek: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavouriteSchema = new Schema<IFavourite>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trek: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trek",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate favourites
FavouriteSchema.index({ user: 1, trek: 1 }, { unique: true });

export default mongoose.model<IFavourite>("Favourite", FavouriteSchema);
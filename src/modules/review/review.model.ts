import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  trekId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    trekId: { type: Schema.Types.ObjectId, ref: "Trek", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// One review per user per trek
ReviewSchema.index({ trekId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
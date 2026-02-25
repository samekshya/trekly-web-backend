import mongoose, { Schema, Document } from "mongoose";

export interface ITrek extends Document {
  title: string;
  description: string;
  location: string;
  price: number;
  duration: string; // e.g., "14 Days"
  difficulty: "Easy" | "Moderate" | "Hard";
  image?: string;
}

const TrekSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Moderate", "Hard"], default: "Moderate" },
  image: { type: String },
}, { timestamps: true });

export default mongoose.model<ITrek>("Trek", TrekSchema);

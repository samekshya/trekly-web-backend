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

const TrekSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  // 90+ Marks: Dynamic Itinerary
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  // 90+ Marks: Associated Hotels
  hotels: [{
    name: String,
    contact: String,
    image: String
  }],
  // 90+ Marks: Difficulty and Category
  difficulty: { type: String, enum: ["Easy", "Moderate", "Hard"] },
  category: { type: String, default: "Mountain" }
}, { timestamps: true });


export default mongoose.model<ITrek>("Trek", TrekSchema);

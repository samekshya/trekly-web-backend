import mongoose, { Schema, Document } from "mongoose";

export interface ITrek extends Document {
  name: string;
  description: string;
  location: string;
  duration: number; // days
  difficulty: "Easy" | "Moderate" | "Hard";
  imageUrl: string;
  price?: number;
  itinerary?: { day: number; title: string; description: string }[];
  hotels?: { name: string; contact: string; imageUrl?: string }[];
}

const TrekSchema = new Schema<ITrek>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: Number, required: true }, // e.g. 14
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Hard"],
      default: "Moderate",
      required: true,
    },
    imageUrl: { type: String, required: true },

    price: { type: Number, required: false },

    itinerary: [
      {
        day: { type: Number },
        title: { type: String },
        description: { type: String },
      },
    ],

    hotels: [
      {
        name: { type: String },
        contact: { type: String },
        imageUrl: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ITrek>("Trek", TrekSchema);


// import mongoose, { Schema, Document } from "mongoose";

// export interface ITrek extends Document {
//   title: string;
//   description: string;
//   location: string;
//   price: number;
//   duration: string;
//   difficulty: "Easy" | "Moderate" | "Hard";
//   category: string;      // ← ADD THIS
//   image?: string;
//   itinerary?: { day: number; title: string; description: string }[];
//   hotels?: { name: string; contact: string; image?: string }[];
// }

// const TrekSchema = new Schema<ITrek>({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   location: { type: String, required: true },
//   price: { type: Number, required: true },
//   duration: { type: String, required: true },
//   difficulty: { type: String, enum: ["Easy", "Moderate", "Hard"], default: "Moderate" },
//   category: { type: String, default: "Mountain" },   // ← ADD THIS
//   image: { type: String },
//   itinerary: [{
//     day: Number,
//     title: String,
//     description: String,
//   }],
//   hotels: [{
//     name: String,
//     contact: String,
//     image: String,
//   }],
// }, { timestamps: true });

// export default mongoose.model<ITrek>("Trek", TrekSchema);

// // import mongoose, { Schema, Document } from "mongoose";

// // export interface ITrek extends Document {
// //   title: string;
// //   description: string;
// //   location: string;
// //   price: number;
// //   duration: string; // e.g., "14 Days"
// //   difficulty: "Easy" | "Moderate" | "Hard";
// //   image?: string;
// // }

// // const TrekSchema = new Schema({
// //   title: { type: String, required: true },
// //   description: { type: String, required: true },
// //   price: { type: Number, required: true },
// //   // Dynamic Itinerary
// //   itinerary: [{
// //     day: Number,
// //     title: String,
// //     description: String
// //   }],
// //   // Associated Hotels
// //   hotels: [{
// //     name: String,
// //     contact: String,
// //     image: String
// //   }],
// //   //  Difficulty and Category
// //   difficulty: { type: String, enum: ["Easy", "Moderate", "Hard"] },
// //   category: { type: String, default: "Mountain" }
// // }, { timestamps: true });


// // export default mongoose.model<ITrek>("Trek", TrekSchema);

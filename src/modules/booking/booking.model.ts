import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  trekId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  date: string;
  people: number;
  notes?: string;
  totalPrice: number;
}

const BookingSchema = new Schema<IBooking>(
  {
    trekId: { type: Schema.Types.ObjectId, ref: "Trek", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    people: { type: Number, required: true },
    notes: { type: String },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
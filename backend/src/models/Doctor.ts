import mongoose, { Schema, Document } from "mongoose";

export interface ISlot {
  date: string;
  time: string;
}

export interface IDoctor extends Document {
  name: string;
  specialization: string;
  fees: number;
  availableSlots: ISlot[];
  createdAt: Date;
  updatedAt: Date;
}

const slotSchema = new Schema<ISlot>(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    fees: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Fees cannot be negative"],
    },
    availableSlots: {
      type: [slotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for filtering by specialization
doctorSchema.index({ specialization: 1 });

export default mongoose.model<IDoctor>("Doctor", doctorSchema);

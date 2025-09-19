import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { type } from "os";
import { ref } from "process";
const ExpenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const BudgetSchema = new Schema({
  total: {
    type: Number,
    required: true,
  },
  spent: {
    type: Number,
    required: true,
  },
  expenses: [ExpenseSchema],
});

const FileSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});
const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: {
    type: String,
  },
  startDate: Date,
  endDate: Date,
  destination: [
    {
      type: String,
      required: true,
    },
  ],
  budget: BudgetSchema,
  transport: {
    mode: String,
    details: String,
  },
  accommodation: {
    name: String,
    address: String,
    checkIn: Date,
    checkOut: Date,
  },
  notes: String,
  status: {
    type: String,
    enum: ["Draft", "Planned", "Ongoing", "Completed"],
    default: "Draft",
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  files: [FileSchema],
  reviews: [reviewSchema],
});

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;

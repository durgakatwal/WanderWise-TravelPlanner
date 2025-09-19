import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Profile features
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String, // URL of profile picture
      default: "",
    },
    preferences: {
      type: [String], // e.g. ["budget-travel", "adventure", "luxury"]
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

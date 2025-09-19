import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["text", "image"], default: "text" },
    text: { type: String, trim: true },
    mediaUrl: { type: String }, // for images/files (you already upload to Cloudinary)
  },
  { timestamps: true }
);

// Basic index for fast history queries
MessageSchema.index({ trip: 1, createdAt: -1 });

export default mongoose.model("Message", MessageSchema);

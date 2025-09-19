import asyncHandler from "express-async-handler";
import Message from "../models/message.js";
import { authorizeTripAccess } from "../middlewares/authorizeTripAccess.js";

export const listMessages = asyncHandler(async (req, res) => {
  const { id: tripId } = req.params;
  const userId = req.user.userId;

  const check = await authorizeTripAccess(tripId, userId);
  if (!check.ok) {
    res.status(check.reason === "TRIP_NOT_FOUND" ? 404 : 403);
    throw new Error(
      check.reason === "TRIP_NOT_FOUND" ? "Trip not found" : "Forbidden"
    );
  }

  // Pagination
  const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
  const cursor = req.query.cursor; // pass last message _id to paginate older

  const q = { trip: tripId };
  if (cursor) {
    q._id = { $lt: cursor };
  }

  const messages = await Message.find(q)
    .sort({ _id: -1 }) // newest first
    .limit(limit)
    .populate({ path: "sender", select: "name email" });

  // next cursor
  const nextCursor = messages.length ? messages[messages.length - 1]._id : null;

  res.status(200).json({
    items: messages.reverse(), // oldest -> newest for UI convenience
    nextCursor,
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { id: tripId } = req.params; // Trip ID from URL
  const { text } = req.body; // Message content
  const userId = req.user.userId; // From auth middleware

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Message text is required");
  }

  // Check if user has access to this trip
  const check = await authorizeTripAccess(tripId, userId);
  if (!check.ok) {
    res.status(check.reason === "TRIP_NOT_FOUND" ? 404 : 403);
    throw new Error(
      check.reason === "TRIP_NOT_FOUND" ? "Trip not found" : "Forbidden"
    );
  }

  // Save message
  const newMessage = await Message.create({
    trip: tripId,
    sender: userId,
    text,
  });

  // Populate sender info
  const populatedMessage = await newMessage.populate("sender", "name email");

  res.status(201).json(populatedMessage);
});

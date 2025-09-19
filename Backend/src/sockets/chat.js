import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message.js";
import { authorizeTripAccess } from "../middlewares/authorizeTripAccess.js";

export function initChatSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // Socket auth middleware using JWT
  io.use((socket, next) => {
    try {
      // Expect token from client: socket.io({ auth: { token } })
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("UNAUTHORIZED"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      return next();
    } catch (err) {
      return next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket) => {
    // Client requests to join a specific trip room
    socket.on("joinTrip", async ({ tripId }) => {
      const check = await authorizeTripAccess(tripId, socket.userId);
      if (!check.ok) {
        socket.emit("error", {
          message:
            check.reason === "TRIP_NOT_FOUND" ? "Trip not found" : "Forbidden",
        });
        return;
      }
      socket.join(tripId);
      socket.emit("joined", { tripId });
    });

    // Send a message
    socket.on(
      "sendMessage",
      async ({ tripId, text, type = "text", mediaUrl }) => {
        try {
          // Guard: must be in room & authorized
          const rooms = [...socket.rooms];
          if (!rooms.includes(tripId)) {
            const check = await authorizeTripAccess(tripId, socket.userId);
            if (!check.ok) {
              socket.emit("error", { message: "Forbidden" });
              return;
            }
            socket.join(tripId);
          }

          // Basic validation
          if (type === "text") {
            if (!text || !text.trim()) return;
            if (text.length > 2000) return; // simple size guard
          }
          if (type === "image" && !mediaUrl) return;

          const msg = await Message.create({
            trip: tripId,
            sender: socket.userId,
            type,
            text: type === "text" ? text.trim() : undefined,
            mediaUrl: type === "image" ? mediaUrl : undefined,
          });

          // Populate sender minimal fields for UI (optional)
          await msg.populate({ path: "sender", select: "name email" });

          io.to(tripId).emit("newMessage", msg);
        } catch (e) {
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    socket.on("disconnect", () => {
      // optional: presence tracking
    });
  });

  return io;
}

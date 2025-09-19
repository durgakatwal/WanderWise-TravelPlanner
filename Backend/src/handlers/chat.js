import { Router } from "express";
import { listMessages, sendMessage } from "../services/chat.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // your existing JWT auth that sets req.user.userId

const router = Router();

// GET /trips/:id/messages?limit=50&cursor=<messageId>
router.get("/trips/:id/messages", authMiddleware, listMessages);
router.post("/:id/messages", authMiddleware, sendMessage);
export default router;

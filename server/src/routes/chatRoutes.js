import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createConversation, getMyConversations, getMessages, markConversationRead } from "../controllers/chatController.js";

const router = express.Router();
router.use(protect);
router.post("/conversations", createConversation);
router.get("/conversations", getMyConversations);
router.get("/conversations/:id/messages", getMessages);
router.patch("/conversations/:id/read", markConversationRead);

export default router;

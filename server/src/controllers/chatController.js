import Sequelize from "sequelize";
import Conversation from "../models/Conversation.js";
import ConversationParticipant from "../models/ConversationParticipant.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import RFQ from "../models/RFQ.js";

const { Op } = Sequelize;

const conversationInclude = [
  {
    model: RFQ,
    as: "rfq",
    attributes: ["id", "productName", "status", "buyerId"],
  },
  {
    model: ConversationParticipant,
    as: "participants",
    include: [{
      model: User,
      as: "user",
      attributes: ["id", "name", "email", "role"],
    }],
  },
];

export const createConversation = async (req, res) => {
  try {
    const { participantIds = [], rfqId = null } = req.body;
    const requested = Array.isArray(participantIds) ? participantIds : [participantIds];
    const uniqueIds = [...new Set([Number(req.user.id), ...requested.map(Number)])].filter(Boolean);

    if (uniqueIds.length < 2) {
      return res.status(400).json({ success: false, message: "At least one other participant is required" });
    }

    const users = await User.findAll({
      where: { id: { [Op.in]: uniqueIds }, isActive: true },
      attributes: ["id", "name", "email", "role"],
    });

    if (users.length !== uniqueIds.length) {
      return res.status(400).json({ success: false, message: "One or more participants are invalid" });
    }

    if (rfqId) {
      const rfq = await RFQ.findByPk(rfqId);
      if (!rfq) return res.status(404).json({ success: false, message: "RFQ not found" });
      if (rfq.buyerId !== req.user.id && !uniqueIds.includes(Number(rfq.buyerId))) {
        return res.status(403).json({ success: false, message: "You are not associated with this RFQ" });
      }
    }

    // Reuse a conversation when the same people are already connected for this RFQ.
    if (rfqId) {
      const candidates = await Conversation.findAll({
        where: { rfqId },
        include: [{ model: ConversationParticipant, as: "participants", attributes: ["userId"] }],
      });
      const wanted = [...uniqueIds].sort((a, b) => a - b);
      const existing = candidates.find((conversation) => {
        const actual = conversation.participants.map((p) => Number(p.userId)).sort((a, b) => a - b);
        return JSON.stringify(actual) === JSON.stringify(wanted);
      });
      if (existing) {
        const complete = await Conversation.findByPk(existing.id, { include: conversationInclude });
        return res.json({ success: true, existing: true, data: complete });
      }
    }

    const conversation = await Conversation.create({ rfqId: rfqId || null });
    await ConversationParticipant.bulkCreate(
      uniqueIds.map((userId) => ({ conversationId: conversation.id, userId }))
    );

    const complete = await Conversation.findByPk(conversation.id, { include: conversationInclude });
    return res.status(201).json({ success: true, existing: false, data: complete });
  } catch (error) {
    console.error("Create conversation error:", error);
    return res.status(500).json({ success: false, message: "Failed to create conversation" });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      include: [{
        model: ConversationParticipant,
        as: "participants",
        required: true,
        where: { userId: req.user.id },
        attributes: ["id", "conversationId", "userId", "lastReadAt"],
        include: [{ model: User, as: "user", attributes: ["id", "name", "email", "role"] }],
      }, {
        model: RFQ,
        as: "rfq",
        attributes: ["id", "productName", "status", "buyerId"],
      }],
      order: [["updatedAt", "DESC"]],
    });

    return res.json({ success: true, data: conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const participant = await ConversationParticipant.findOne({
      where: { conversationId: req.params.id, userId: req.user.id },
    });
    if (!participant) {
      return res.status(403).json({ success: false, message: "You are not a participant in this conversation" });
    }

    const messages = await Message.findAll({
      where: { conversationId: req.params.id },
      include: [{ model: User, as: "sender", attributes: ["id", "name", "role"] }],
      order: [["createdAt", "ASC"]],
    });

    return res.json({ success: true, data: messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

export const markConversationRead = async (req, res) => {
  try {
    const participant = await ConversationParticipant.findOne({
      where: { conversationId: req.params.id, userId: req.user.id },
    });
    if (!participant) return res.status(403).json({ success: false, message: "Not a conversation participant" });

    participant.lastReadAt = new Date();
    await participant.save();
    await Message.update(
      { isRead: true },
      { where: { conversationId: req.params.id, senderId: { [Op.ne]: req.user.id } } }
    );

    return res.json({ success: true, message: "Conversation marked as read" });
  } catch (error) {
    console.error("Mark conversation read error:", error);
    return res.status(500).json({ success: false, message: "Failed to mark conversation as read" });
  }
};

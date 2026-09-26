import Sequelize from "sequelize";
import ConversationParticipant from "../models/ConversationParticipant.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const { Op } = Sequelize;

export const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    const userId = Number(socket.user.id);
    socket.join(`user:${userId}`);
    io.emit("presence:update", { userId, status: "ONLINE" });

    socket.on("conversation:join", async ({ conversationId }, callback) => {
      try {
        const participant = await ConversationParticipant.findOne({
          where: { conversationId: Number(conversationId), userId },
        });
        if (!participant) throw new Error("You are not a participant in this conversation");
        socket.join(`conversation:${Number(conversationId)}`);
        callback?.({ success: true });
      } catch (error) {
        callback?.({ success: false, message: error.message });
        socket.emit("chat:error", { message: error.message });
      }
    });

    socket.on("message:send", async ({ conversationId, message, messageType = "TEXT" }, callback) => {
      try {
        const id = Number(conversationId);
        const participant = await ConversationParticipant.findOne({
          where: { conversationId: id, userId },
        });
        if (!participant) throw new Error("You are not a participant in this conversation");

        const text = String(message || "").trim();
        if (!text) throw new Error("Message cannot be empty");

        const saved = await Message.create({
          conversationId: id,
          senderId: userId,
          message: text,
          messageType,
        });

        const fullMessage = await Message.findByPk(saved.id, {
          include: [{ model: User, as: "sender", attributes: ["id", "name", "role"] }],
        });

        await ConversationParticipant.findAll({
          where: { conversationId: id, userId: { [Op.ne]: userId } },
          attributes: ["userId"],
        }).then(async (recipients) => {
          for (const recipient of recipients) {
            const notification = await Notification.create({
              userId: recipient.userId,
              type: "MESSAGE",
              title: "New message",
              message: `${fullMessage.sender?.name || "A participant"} sent you a message.`,
              referenceId: id,
            });
            io.to(`user:${recipient.userId}`).emit("notification:new", notification);
          }
        });

        io.to(`conversation:${id}`).emit("message:new", fullMessage);
        io.to(`conversation:${id}`).emit("conversation:updated", { conversationId: id });

        callback?.({ success: true, data: fullMessage });
      } catch (error) {
        console.error("Socket message error:", error);
        callback?.({ success: false, message: error.message || "Message failed" });
      }
    });

    const typingEvent = async (event, data = {}) => {
      const id = Number(data.conversationId);
      const participant = await ConversationParticipant.findOne({ where: { conversationId: id, userId } });
      if (participant) socket.to(`conversation:${id}`).emit(event, { conversationId: id, userId });
    };

    socket.on("typing:start", (data) => typingEvent("typing:start", data));
    socket.on("typing:stop", (data) => typingEvent("typing:stop", data));

    socket.on("message:read", async ({ conversationId }) => {
      const id = Number(conversationId);
      const participant = await ConversationParticipant.findOne({ where: { conversationId: id, userId } });
      if (!participant) return;
      await Message.update(
        { isRead: true },
        { where: { conversationId: id, senderId: { [Op.ne]: userId }, isRead: false } }
      );
      participant.lastReadAt = new Date();
      await participant.save();
      io.to(`conversation:${id}`).emit("message:read", { conversationId: id, userId, readAt: participant.lastReadAt });
    });

    socket.on("disconnect", () => {
      io.emit("presence:update", { userId, status: "OFFLINE", lastActiveAt: new Date() });
    });
  });
};

import User from "./User.js";
import RFQ from "./RFQ.js";
import Quotation from "./Quotation.js";
import OTPVerification from "./OTPVerification.js";
import Conversation from "./Conversation.js";
import ConversationParticipant from "./ConversationParticipant.js";
import Message from "./Message.js";
import Notification from "./Notification.js";

User.hasMany(RFQ, {
  foreignKey: "buyerId",
  as: "rfqs",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
RFQ.belongsTo(User, {
  foreignKey: "buyerId",
  as: "buyer",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Quotation, {
  foreignKey: "supplierId",
  as: "quotations",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Quotation.belongsTo(User, {
  foreignKey: "supplierId",
  as: "supplier",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RFQ.hasMany(Quotation, {
  foreignKey: "rfqId",
  as: "quotations",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Quotation.belongsTo(RFQ, {
  foreignKey: "rfqId",
  as: "rfq",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(OTPVerification, {
  foreignKey: "userId",
  as: "otpVerifications",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
OTPVerification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RFQ.hasMany(Conversation, {
  foreignKey: "rfqId",
  as: "conversations",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Conversation.belongsTo(RFQ, {
  foreignKey: "rfqId",
  as: "rfq",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Conversation.hasMany(ConversationParticipant, {
  foreignKey: "conversationId",
  as: "participants",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ConversationParticipant.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(ConversationParticipant, {
  foreignKey: "userId",
  as: "conversationParticipants",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ConversationParticipant.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Conversation.hasMany(Message, {
  foreignKey: "conversationId",
  as: "messages",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Message, {
  foreignKey: "senderId",
  as: "sentMessages",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export {
  User,
  RFQ,
  Quotation,
  OTPVerification,
  Conversation,
  ConversationParticipant,
  Message,
  Notification,
};

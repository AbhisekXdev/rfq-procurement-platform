import Sequelize from "sequelize";
import { sequelize } from "../config/database.js";

const { DataTypes } = Sequelize;

const ConversationParticipant = sequelize.define(
  "ConversationParticipant",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    conversationId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    lastReadAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "conversation_participants", timestamps: true, indexes: [{ unique: true, fields: ["conversationId", "userId"] }] }
);

export default ConversationParticipant;

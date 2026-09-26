import Sequelize from "sequelize";
import { sequelize } from "../config/database.js";

const { DataTypes } = Sequelize;

const Conversation = sequelize.define(
  "Conversation",
  { id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, rfqId: { type: DataTypes.INTEGER, allowNull: true } },
  { tableName: "conversations", timestamps: true }
);

export default Conversation;

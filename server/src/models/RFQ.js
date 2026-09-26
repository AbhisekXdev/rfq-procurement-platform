import Sequelize from "sequelize";
import { sequelize } from "../config/database.js";

const { DataTypes } = Sequelize;

const RFQ = sequelize.define(
  "RFQ",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    buyerId: { type: DataTypes.INTEGER, allowNull: false },
    productName: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    deliveryLocation: { type: DataTypes.STRING(200), allowNull: false },
    deadline: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM("OPEN", "CLOSED", "AWARDED", "CANCELLED"),
      allowNull: false,
      defaultValue: "OPEN",
    },
    category: { type: DataTypes.STRING(100), allowNull: true },
    budget: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "INR" },
  },
  { tableName: "rfqs", timestamps: true }
);

export default RFQ;

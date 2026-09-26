import Sequelize from "sequelize";
import { sequelize } from "../config/database.js";

const { DataTypes } = Sequelize;

const Quotation = sequelize.define(
  "Quotation",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rfqId: { type: DataTypes.INTEGER, allowNull: false },
    supplierId: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    estimatedDeliveryTime: { type: DataTypes.STRING(100), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("SUBMITTED", "NEGOTIATION", "ACCEPTED", "REJECTED", "WITHDRAWN"),
      allowNull: false,
      defaultValue: "SUBMITTED",
    },
  },
  { tableName: "quotations", timestamps: true }
);

export default Quotation;

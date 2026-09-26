import Sequelize from "sequelize";
import { sequelize } from "../config/database.js";

const { DataTypes } = Sequelize;

const OTPVerification = sequelize.define(
  "OTPVerification",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    email: { type: DataTypes.STRING(150), allowNull: false },
    purpose: { type: DataTypes.ENUM("REGISTER", "LOGIN", "FORGOT_PASSWORD"), allowNull: false },
    otpHash: { type: DataTypes.STRING(255), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    verifiedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "otp_verifications", timestamps: true }
);

export default OTPVerification;

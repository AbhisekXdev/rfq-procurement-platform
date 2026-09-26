import Sequelize from "sequelize";
import { sequelize } from "../config/database.js";

const { DataTypes } = Sequelize;

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM("BUYER", "SUPPLIER", "ADMIN"),
      allowNull: false,
      defaultValue: "BUYER",
    },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isEmailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
    lastActiveAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "users", timestamps: true }
);

export default User;

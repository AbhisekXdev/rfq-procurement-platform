import Sequelize from "sequelize";

const { Op } = Sequelize;
import User from "../models/User.js";
import RFQ from "../models/RFQ.js";
import Quotation from "../models/Quotation.js";

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalBuyers, totalSuppliers, totalAdmins, activeUsers, totalRFQs, openRFQs, totalQuotations] = await Promise.all([
      User.count(),
      User.count({ where: { role: "BUYER" } }),
      User.count({ where: { role: "SUPPLIER" } }),
      User.count({ where: { role: "ADMIN" } }),
      User.count({ where: { isActive: true } }),
      RFQ.count(),
      RFQ.count({ where: { status: "OPEN" } }),
      Quotation.count(),
    ]);

    return res.json({
      success: true,
      data: { totalUsers, totalBuyers, totalSuppliers, totalAdmins, activeUsers, totalRFQs, openRFQs, totalQuotations },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ success: false, message: "Failed to load admin dashboard" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, isActive } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (role && ["BUYER", "SUPPLIER", "ADMIN"].includes(role)) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === "true";

    const users = await User.findAll({ where, order: [["createdAt", "DESC"]] });
    return res.json({ success: true, count: users.length, data: users.map(safeUser) });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, data: safeUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") return res.status(400).json({ success: false, message: "isActive must be boolean" });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.id === req.user.id && !isActive) return res.status(400).json({ success: false, message: "You cannot deactivate your own admin account" });

    user.isActive = isActive;
    await user.save();
    return res.json({ success: true, message: `User ${isActive ? "activated" : "deactivated"} successfully`, data: safeUser(user) });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({ success: false, message: "Failed to update user status" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["BUYER", "SUPPLIER", "ADMIN"].includes(role)) return res.status(400).json({ success: false, message: "Invalid role" });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.id === req.user.id && role !== "ADMIN") return res.status(400).json({ success: false, message: "You cannot remove your own admin role" });

    user.role = role;
    await user.save();
    return res.json({ success: true, message: "User role updated", data: safeUser(user) });
  } catch (error) {
    console.error("Update user role error:", error);
    return res.status(500).json({ success: false, message: "Failed to update user role" });
  }
};

import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();
const adminOnly = [protect, adminMiddleware];

router.get("/dashboard", ...adminOnly, getDashboardStats);
router.get("/users", ...adminOnly, getAllUsers);
router.get("/users/:id", ...adminOnly, getUserById);
router.patch("/users/:id/status", ...adminOnly, updateUserStatus);
router.patch("/users/:id/role", ...adminOnly, updateUserRole);

export default router;

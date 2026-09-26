import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import http from "http";
import bcrypt from "bcryptjs";
import { Server as SocketIOServer } from "socket.io";

import { sequelize, connectDatabase } from "./src/config/database.js";
import User from "./src/models/User.js";
import RFQ from "./src/models/RFQ.js";
import Quotation from "./src/models/Quotation.js";
import OTPVerification from "./src/models/OTPVerification.js";
import Conversation from "./src/models/Conversation.js";
import ConversationParticipant from "./src/models/ConversationParticipant.js";
import Message from "./src/models/Message.js";
import Notification from "./src/models/Notification.js";
import "./src/models/associations.js";

import authRoutes from "./src/routes/authRoutes.js";
import testRoutes from "./src/routes/testRoutes.js";
import rfqRoutes from "./src/routes/rfqRoutes.js";
import quotationRoutes from "./src/routes/quotationRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import { authenticateSocket } from "./src/sockets/authenticateSocket.js";
import { registerChatSocket } from "./src/sockets/chatSocket.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((value) => value.trim()).filter(Boolean)
  : true;

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    console.error("❌ Invalid JSON request", req.method, req.originalUrl);
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request. Send a JSON object with Content-Type: application/json.",
    });
  }
  next(error);
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RFQ Marketplace API is running",
    database: "Aiven MySQL",
    realtime: "Socket.IO",
  });
});

const io = new SocketIOServer(httpServer, {
  cors: { origin: allowedOrigins, credentials: true },
});

io.use(authenticateSocket);
registerChatSocket(io);

const repairOrphanData = async () => {
  if (process.env.DB_REPAIR_ORPHANS === "false") return;

  console.warn("⚠️ DB_REPAIR_ORPHANS=true: checking orphan records...");

  const queries = [
    `DELETE q FROM quotations q LEFT JOIN rfqs r ON r.id = q.rfqId WHERE r.id IS NULL`,
    `DELETE q FROM quotations q LEFT JOIN users u ON u.id = q.supplierId WHERE u.id IS NULL`,
    `DELETE r FROM rfqs r LEFT JOIN users u ON u.id = r.buyerId WHERE u.id IS NULL`,
    `DELETE cp FROM conversation_participants cp LEFT JOIN conversations c ON c.id = cp.conversationId WHERE c.id IS NULL`,
    `DELETE cp FROM conversation_participants cp LEFT JOIN users u ON u.id = cp.userId WHERE u.id IS NULL`,
    `DELETE m FROM messages m LEFT JOIN conversations c ON c.id = m.conversationId WHERE c.id IS NULL`,
    `DELETE m FROM messages m LEFT JOIN users u ON u.id = m.senderId WHERE u.id IS NULL`,
    `DELETE n FROM notifications n LEFT JOIN users u ON u.id = n.userId WHERE u.id IS NULL`,
    `DELETE o FROM otp_verifications o LEFT JOIN users u ON u.id = o.userId WHERE o.userId IS NOT NULL AND u.id IS NULL`,
  ];

  for (const sql of queries) {
    try {
      await sequelize.query(sql);
    } catch (error) {
      if (process.env.DB_LOGGING === "true") console.warn("Orphan cleanup skipped:", error.message);
    }
  }

  console.log("✅ Orphan-data check completed");
};

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("⚠️ ADMIN_EMAIL/ADMIN_PASSWORD not configured; admin seed skipped");
    return;
  }

  let admin = await User.findOne({ where: { email } });

  if (admin) {
    admin.role = "ADMIN";
    admin.isActive = true;
    admin.isEmailVerified = true;
    await admin.save();
    console.log(`✅ Admin account ready: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    name: process.env.ADMIN_NAME || "System Admin",
    email,
    password: hashedPassword,
    role: "ADMIN",
    isActive: true,
    isEmailVerified: true,
  });

  console.log(`✅ Admin account created: ${email}`);
};

const syncDatabase = async () => {
  const alter = process.env.DB_SYNC_ALTER !== "false";

  // All associations are loaded before this call.
  await sequelize.sync({ alter });

  console.log(`✅ Database synchronized successfully (alter=${alter})`);
};

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await connectDatabase();
    await repairOrphanData();
    await syncDatabase();
    await ensureAdminUser();

    httpServer.listen(PORT, () => {
      console.log("=================================");
      console.log(`🚀 RFQ Marketplace running on port ${PORT}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
      console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
      console.log("🔌 Socket.IO: enabled");
      console.log("=================================");
    });
  } catch (error) {
    console.error("❌ Server startup failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { createAndSendOtp, verifyOtp, hashPassword } from "../services/otpService.js";

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  isActive: user.isActive,
});

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (!name || !normalizedEmail || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!["BUYER", "SUPPLIER"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be BUYER or SUPPLIER" });
    }

    let user = await User.findOne({ where: { email: normalizedEmail } });

    if (user?.isEmailVerified) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await hashPassword(password);

    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.role = role;
      user.isActive = true;
      await user.save();
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        isEmailVerified: false,
        isActive: true,
      });
    }

    const otp = await createAndSendOtp({
      userId: user.id,
      email: normalizedEmail,
      purpose: "REGISTER",
    });

    return res.status(201).json({
      success: true,
      message: "Registration started. OTP sent to your email.",
      requiresOtp: true,
      email: normalizedEmail,
      otpExpiresIn: otp.expiresInSeconds,
    });
  } catch (error) {
    console.error("Register user error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal server error",
    });
  }
};

export const verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const record = await verifyOtp({ email: normalizedEmail, purpose: "REGISTER", otp });
    const user = await User.findOne({ where: { id: record.userId, email: normalizedEmail } });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isEmailVerified = true;
    await user.save();

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      message: "Email verified and account activated",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || "OTP verification failed" });
  }
};

export const resendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user || user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Registration OTP cannot be resent for this email" });
    }

    const result = await createAndSendOtp({ userId: user.id, email: normalizedEmail, purpose: "REGISTER" });
    return res.status(200).json({ success: true, message: "OTP resent successfully", otpExpiresIn: result.expiresInSeconds });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Failed to resend OTP" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) return res.status(403).json({ success: false, message: "Account is inactive" });
    if (!user.isEmailVerified) return res.status(403).json({ success: false, message: "Please verify your email before login" });
    if (role && user.role !== role) return res.status(403).json({ success: false, message: `This account is not registered as ${role}` });

    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      requiresOtp: false,
      token: generateToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const record = await verifyOtp({ email: normalizedEmail, purpose: "LOGIN", otp });
    const user = await User.findOne({ where: { id: record.userId, email: normalizedEmail } });

    if (!user || !user.isActive || !user.isEmailVerified) {
      return res.status(403).json({ success: false, message: "Account is not available for login" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || "OTP verification failed" });
  }
};

export const resendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user || !user.isActive || !user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Unable to resend login OTP" });
    }
    const result = await createAndSendOtp({ userId: user.id, email: normalizedEmail, purpose: "LOGIN" });
    return res.status(200).json({ success: true, message: "Login OTP resent", otpExpiresIn: result.expiresInSeconds });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Failed to resend OTP" });
  }
};

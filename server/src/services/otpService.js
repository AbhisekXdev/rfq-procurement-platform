import crypto from "crypto";
import bcrypt from "bcryptjs";
import OTPVerification from "../models/OTPVerification.js";
import { sendOtpEmail } from "./emailService.js";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
const OTP_RESEND_SECONDS = Number(process.env.OTP_RESEND_SECONDS || 60);

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

export const createAndSendOtp = async ({ userId = null, email, purpose }) => {
  const latest = await OTPVerification.findOne({
    where: { email, purpose },
    order: [["createdAt", "DESC"]],
  });

  if (latest && Date.now() - new Date(latest.createdAt).getTime() < OTP_RESEND_SECONDS * 1000) {
    const remaining = Math.ceil(
      (OTP_RESEND_SECONDS * 1000 - (Date.now() - new Date(latest.createdAt).getTime())) / 1000
    );
    const error = new Error(`Please wait ${remaining} seconds before requesting another OTP`);
    error.statusCode = 429;
    throw error;
  }

  const otp = generateOtp();
  const otpRecord = await OTPVerification.create({
    userId,
    email,
    purpose,
    otpHash: hashOtp(otp),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  try {
    await sendOtpEmail({ to: email, otp, purpose });
  } catch (error) {
    await otpRecord.destroy();
    throw error;
  }

  return { expiresInSeconds: OTP_EXPIRY_MINUTES * 60 };
};

export const verifyOtp = async ({ email, purpose, otp }) => {
  const record = await OTPVerification.findOne({
    where: { email, purpose, verifiedAt: null },
    order: [["createdAt", "DESC"]],
  });

  if (!record) {
    const error = new Error("OTP not found or already used");
    error.statusCode = 400;
    throw error;
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    const error = new Error("OTP has expired");
    error.statusCode = 400;
    throw error;
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    const error = new Error("Maximum OTP attempts exceeded");
    error.statusCode = 429;
    throw error;
  }

  record.attempts += 1;
  await record.save();

  const isValid = hashOtp(otp) === record.otpHash;
  if (!isValid) {
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  record.verifiedAt = new Date();
  await record.save();
  return record;
};

export const hashPassword = (password) => bcrypt.hash(password, 12);

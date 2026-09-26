import nodemailer from "nodemailer";

const getTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Gmail SMTP credentials are not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

export const sendOtpEmail = async ({ to, otp, purpose }) => {
  const transporter = getTransporter();
  const purposeText = {
    REGISTER: "verify your RFQ Marketplace account",
    LOGIN: "complete your RFQ Marketplace login",
    FORGOT_PASSWORD: "reset your RFQ Marketplace password",
  }[purpose];

  await transporter.sendMail({
    from: `RFQ Marketplace <${process.env.GMAIL_USER}>`,
    to,
    subject: `Your RFQ Marketplace OTP: ${otp}`,
    text: `Your OTP to ${purposeText} is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2>RFQ Marketplace</h2>
        <p>Use the following OTP to ${purposeText}:</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${otp}</div>
        <p>This code expires in <strong>5 minutes</strong>.</p>
        <p>If you did not request this code, you can safely ignore this email.</p>
      </div>
    `,
  });
};

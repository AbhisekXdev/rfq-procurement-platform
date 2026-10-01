import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_SECRET_KEY,
  },
});

export const sendOtpEmail = async ({ to, otp, purpose }) => {
  if (!process.env.MAILJET_API_KEY) {
    throw new Error("Mailjet API key is not configured");
  }

  if (!process.env.MAILJET_SECRET_KEY) {
    throw new Error("Mailjet secret key is not configured");
  }

  if (!process.env.MAILJET_SENDER_EMAIL) {
    throw new Error("Mailjet sender email is not configured");
  }

  const purposeText = {
    REGISTER: "verify your RFQ Marketplace account",
    LOGIN: "complete your RFQ Marketplace login",
    FORGOT_PASSWORD: "reset your RFQ Marketplace password",
  }[purpose] || "complete your RFQ Marketplace verification";

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAILJET_SENDER_NAME || "RFQ Marketplace"}" <${process.env.MAILJET_SENDER_EMAIL}>`,

      to,

      subject: `Your RFQ Marketplace OTP: ${otp}`,

      text: `
Your OTP to ${purposeText} is ${otp}.

This OTP expires in 5 minutes.

Do not share this code with anyone.

If you did not request this code, you can safely ignore this email.

RFQ Marketplace
B2B Procurement Platform
      `,

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>RFQ Marketplace OTP</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f7fb;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:560px;
    margin:40px auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 8px 30px rgba(15,23,42,0.08);
  ">

    <!-- Header -->
    <div style="
      background:linear-gradient(135deg,#2563eb,#4f46e5);
      padding:28px 24px;
      text-align:center;
    ">

      <h1 style="
        margin:0;
        color:#ffffff;
        font-size:24px;
      ">
        RFQ Marketplace
      </h1>

      <p style="
        margin:8px 0 0;
        color:#dbeafe;
        font-size:14px;
      ">
        B2B Procurement Platform
      </p>

    </div>

    <!-- Content -->
    <div style="padding:32px 28px;">

      <h2 style="
        margin:0 0 16px;
        color:#111827;
        font-size:22px;
      ">
        Verification Code
      </h2>

      <p style="
        color:#4b5563;
        font-size:15px;
        line-height:1.6;
      ">
        Use the following OTP to ${purposeText}.
      </p>

      <!-- OTP -->
      <div style="
        margin:28px 0;
        padding:20px;
        background:#eff6ff;
        border:1px solid #bfdbfe;
        border-radius:12px;
        text-align:center;
      ">

        <div style="
          font-size:34px;
          font-weight:700;
          letter-spacing:10px;
          color:#2563eb;
        ">
          ${otp}
        </div>

      </div>

      <p style="
        color:#374151;
        font-size:14px;
        line-height:1.6;
      ">
        This verification code expires in
        <strong>5 minutes</strong>.
      </p>

      <p style="
        color:#6b7280;
        font-size:14px;
        line-height:1.6;
      ">
        Never share this OTP with anyone.
        RFQ Marketplace will never ask you to share
        your verification code.
      </p>

      <hr style="
        border:none;
        border-top:1px solid #e5e7eb;
        margin:28px 0;
      " />

      <p style="
        margin:0;
        color:#9ca3af;
        font-size:12px;
        line-height:1.5;
      ">
        If you did not request this code,
        you can safely ignore this email.
      </p>

    </div>

    <!-- Footer -->
    <div style="
      background:#f9fafb;
      padding:18px 28px;
      text-align:center;
    ">

      <p style="
        margin:0;
        color:#9ca3af;
        font-size:12px;
      ">
        © ${new Date().getFullYear()} RFQ Marketplace
      </p>

    </div>

  </div>

</body>
</html>
      `,
    });

    console.log("✅ Mailjet OTP email sent:", {
      messageId: info.messageId,
      response: info.response,
    });

    return info;

  } catch (error) {
    console.error("❌ Mailjet OTP email error:", error);

    throw new Error(
      error?.message || "Failed to send OTP email"
    );
  }
};
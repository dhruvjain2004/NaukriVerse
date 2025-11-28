import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

let transporter = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export const sendOtpEmail = async (to, otp) => {
  if (!transporter) {
    throw new Error("Email service is not configured");
  }

  const fromAddress = process.env.EMAIL_FROM || smtpUser;

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "Your NaukriVerse login OTP",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>.</p><p>This code expires in 5 minutes.</p>`,
  });
};


import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/mailer.js";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  mobileNumber: user.mobileNumber,
  workStatus: user.workStatus,
  headline: user.headline,
  location: user.location,
  gender: user.gender,
  birthday: user.birthday,
  degree: user.degree,
  institute: user.institute,
  about: user.about,
  preferredJobType: user.preferredJobType,
  availability: user.availability,
  resume: user.resume,
  image: user.image,
});

export const registerUser = async (req, res) => {
  const { fullName, email, password, workStatus } = req.body;

  // Validate all required fields
  if (!fullName || !fullName.trim()) {
    return res.json({ success: false, message: "Full name is required." });
  }
  if (!email || !email.trim()) {
    return res.json({ success: false, message: "Email is required." });
  }
  if (!password || !password.trim()) {
    return res.json({ success: false, message: "Password is required." });
  }
  if (!workStatus || !workStatus.trim()) {
    return res.json({ success: false, message: "Work status is required." });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.json({ success: false, message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: fullName.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      workStatus,
    });

    res.json({
      success: true,
      message: "Account created successfully.",
      token: generateToken(user._id),
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password." });
    }

    res.json({
      success: true,
      message: "Logged in successfully.",
      token: generateToken(user._id),
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.json({ success: false, message: "Google credential missing." });
  }

  if (!googleClient) {
    return res.json({ success: false, message: "Google auth is not configured." });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name || "Google User",
        email: payload.email,
        mobileNumber: payload.phone_number || "NA",
        workStatus: "experienced",
        googleId: payload.sub,
        image: payload.picture,
        password: null,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      if (!user.image && payload.picture) {
        user.image = payload.picture;
      }
      await user.save();
    }

    res.json({
      success: true,
      message: "Authenticated with Google.",
      token: generateToken(user._id),
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const requestOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "No account found with this email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.otpCode = hashedOtp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    if (process.env.NODE_ENV === "development") {
      console.log(`OTP for ${email}: ${otp}`);
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      await sendOtpEmail(email, otp);
    }

    res.json({
      success: true,
      message: "OTP sent to your registered email.",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ success: false, message: "Email and OTP are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otpCode || !user.otpExpiry) {
      return res.json({ success: false, message: "OTP not requested or already used." });
    }

    if (user.otpExpiry < new Date()) {
      user.otpCode = "";
      user.otpExpiry = null;
      await user.save();
      return res.json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    const isValidOtp = await bcrypt.compare(otp, user.otpCode);
    if (!isValidOtp) {
      return res.json({ success: false, message: "Invalid OTP. Please try again." });
    }

    user.otpCode = "";
    user.otpExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: "Logged in with OTP.",
      token: generateToken(user._id),
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const buildAdminPayload = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  avatar: admin.avatar,
});

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required." });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: "Admin already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ name, email, password: hashedPassword });

    res.json({
      success: true,
      message: "Admin account created.",
      token: generateToken(admin._id),
      admin: buildAdminPayload(admin),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password are required." });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials." });
    }

    res.json({
      success: true,
      message: "Admin login successful.",
      token: generateToken(admin._id),
      admin: buildAdminPayload(admin),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


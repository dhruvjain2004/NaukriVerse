import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    mobileNumber: { type: String, required: true },
    workStatus: { type: String, enum: ["experienced", "fresher"], required: true },
    headline: { type: String, default: "" },
    location: { type: String, default: "" },
    gender: { type: String, default: "" },
    birthday: { type: String, default: "" },
    degree: { type: String, default: "" },
    institute: { type: String, default: "" },
    about: { type: String, default: "" },
    preferredJobType: { type: String, default: "" },
    availability: { type: String, default: "" },
    resume: { type: String, default: "" },
    otpCode: { type: String, default: "" },
    otpExpiry: { type: Date },
    image: {
      type: String,
      default: "https://ui-avatars.com/api/?background=3b82f6&color=fff&name=Candidate",
    },
    googleId: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
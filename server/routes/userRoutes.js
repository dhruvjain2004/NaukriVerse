import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
  updateUserProfile,
  updateUserImage,
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/userController.js";
import upload from "../config/multer.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", protectUser, getUserData);
router.post("/apply", protectUser, applyForJob);
router.get("/applications", protectUser, getUserJobApplications);
router.post("/update-resume", protectUser, upload.single("resume"), updateUserResume);
router.patch("/profile", protectUser, updateUserProfile);
router.post("/update-image", protectUser, upload.single("image"), updateUserImage);
router.get("/new-job-notifications", protectUser, getUserNotifications);
router.patch("/notifications/:notificationId/read", protectUser, markNotificationAsRead);

export default router;


import express from "express";
import {
	getUserProfileController,
	loginController,
	logoutController,
	registerController,
	resetPasswordController,
	updatePasswordController,
	updateProfileController,
	updateProfilePicController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import { rateLimit } from "express-rate-limit";

// Rate Limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
});

// router object
const router = express.Router();

// router
// register
router.post("/register", limiter, registerController);

// login
router.post("/login", limiter, loginController);

// Profile
router.get("/profile", isAuth, getUserProfileController);

// Logout
router.get("/logout", isAuth, logoutController);

// Update Profile
router.put("/update-profile", isAuth, updateProfileController);

// Update Password
router.put("/update-password", isAuth, updatePasswordController);

// Update Profile Pic
router.put("/update-picture", singleUpload, isAuth, updateProfilePicController);

// Forget Password
router.post("/reset-password", resetPasswordController);

export default router;

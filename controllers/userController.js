import userModel from "../models/UserModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

export const registerController = async (req, res) => {
	try {
		const { name, email, password, address, city, country, phone, answer } =
			req.body;

		// validation
		if (
			!name ||
			!email ||
			!password ||
			!address ||
			!city ||
			!country ||
			!phone ||
			!answer
		) {
			returnres.status(500).send({
				success: false,
				message: "Error in Register API",
				error,
			});
		}

		// Check existing user
		const existingUser = await userModel.findOne({ email });
		// Validation
		if (existingUser) {
			return res.status(500).send({
				success: false,
				message: "email already taken",
			});
		}

		const user = await userModel.create({
			name,
			email,
			password,
			address,
			city,
			country,
			phone,
			answer,
		});

		res.status(201).send({
			success: true,
			message: "Registeration Success, please login",
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Register API",
			error,
		});
	}
};

// login
export const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validation
		if (!email || !password) {
			return res.status(500).send({
				success: false,
				message: "Please Add Email Or Password",
			});
		}

		// check user
		const user = await userModel.findOne({ email });

		// userValidation
		if (!user) {
			return res.status(404).send({
				success: false,
				message: "User not Found",
			});
		}

		// check password
		const isMatch = await user.comparePassword(password);

		// Validation password
		if (!isMatch) {
			return res.status(500).send({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Token
		const token = user.generateToken();

		res
			.status(200)
			.cookie("token", token, {
				expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
				secure: process.env.NODE_ENV === "development" ? true : false,
				httpOnly: process.env.NODE_ENV === "development" ? true : false,
				sameSite: process.env.NODE_ENV === "development" ? true : false,
			})
			.send({
				success: true,
				message: "Login Successfully",
				token,
				user,
			});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Login Api",
		});
	}
};

// Get user Profile
export const getUserProfileController = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id);
		user.password = undefined;
		res.status(200).send({
			success: true,
			message: "User Profile Fetched Successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Profile Api",
		});
	}
};

// Logout
export const logoutController = async (req, res) => {
	try {
		res
			.status(200)
			.cookie("token", "", {
				expires: new Date(Date.now()),
				secure: process.env.NODE_ENV === "development" ? true : false,
				httpOnly: process.env.NODE_ENV === "development" ? true : false,
				sameSite: process.env.NODE_ENV === "development" ? true : false,
			})
			.send({
				success: true,
				message: "Logout Successfully",
			});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Logout Api",
		});
	}
};

// Update user profile
export const updateProfileController = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id);
		const { name, email, address, city, country, phone } = req.body;

		// Validation + Update
		if (name) user.name = name;
		if (email) user.email = email;
		if (address) user.address = address;
		if (city) user.city = city;
		if (country) user.country = country;
		if (phone) user.phone = phone;

		// Save user
		await user.save();

		res.status(200).send({
			success: true,
			message: "User Profile Updated Successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Update Profile Api",
		});
	}
};

// Update user password
export const updatePasswordController = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id);
		const { oldPassword, newPassword } = req.body;

		// Validation
		if (!oldPassword || !newPassword) {
			res.status(500).send({
				success: false,
				message: "Please provide Old and New Password",
			});
		}

		// Old Password match
		const isMatch = await user.comparePassword(oldPassword);

		// Validation
		if (!isMatch) {
			return res.status(500).send({
				success: false,
				message: "Invalid Old Password",
			});
		}

		user.password = newPassword;

		// Save user
		await user.save();

		res.status(200).send({
			success: true,
			message: "Password Updated Successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Update Password Api",
		});
	}
};

// Updae User Profile Photo
export const updateProfilePicController = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id);

		// get file from client photo
		const file = getDataUri(req.file);

		// Delete previous image
		await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

		// Update profile pic
		const cdb = await cloudinary.v2.uploader.upload(file.content);
		user.profilePic = {
			public_id: cdb.public_id,
			url: cdb.secure_url,
		};

		// Save func
		await user.save();

		res.status(200).send({
			success: true,
			message: "Profile Picture Updated",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Update Profile Pic Api",
		});
	}
};

// Forget Password
export const resetPasswordController = async (req, res) => {
	try {
		const { email, newPassword, answer } = req.body;

		// Validation
		if (!email || !newPassword || !answer) {
			res.status(500).send({
				success: false,
				message: "Please provide All field",
			});
		}

		const user = await userModel.findOne({ email, answer });

		// Validation
		if (!user) {
			res.status(404).send({
				success: false,
				message: "Invalid user or answer",
			});
		}

		user.password = newPassword;
		await user.save();

		res.status(200).send({
			success: true,
			message: "Your Password has been Reset Please Login !",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Reset Password Api",
		});
	}
};

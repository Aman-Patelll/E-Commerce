import express from "express";
import {
	createProductController,
	deleteProductController,
	deleteProductImageController,
	getAllProductsController,
	getSingleProductController,
	getTopProductsController,
	productReviewController,
	updateProductController,
	updateProductImageController,
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Routes
// Get All Product
router.get("/get-all", getAllProductsController);

// Get Top Product
router.get("/top", getTopProductsController);

// Get Single Product
router.get("/:id", getSingleProductController);

// Create Product
router.post("/create", isAuth, isAdmin, singleUpload, createProductController);

// Update Product
router.put("/:id", isAuth, isAdmin, updateProductController);

// Update Product Images
router.put(
	"/image/:id",
	isAuth,
	isAdmin,
	singleUpload,
	updateProductImageController
);

// Delete Product Images
router.delete(
	"/delete-image/:id",
	isAuth,
	isAdmin,
	deleteProductImageController
);

// Delete Product Images
router.delete("/delete/:id", isAuth, isAdmin, deleteProductController);

// Review Product
router.put("/:id/review", isAuth, productReviewController);

export default router;

import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
	createCategoryController,
	deleteCategoryController,
	getAllCategoriesController,
	updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// Routes Category

// Create category
router.post("/create", isAuth, isAdmin, createCategoryController);

// Get category
router.get("/get-all", getAllCategoriesController);

// delete category
router.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController);

// Update category
router.put("/update/:id", isAuth, isAdmin, updateCategoryController);

export default router;

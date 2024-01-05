import categoryModel from "../models/Category.js";
import productModel from "../models/ProductModel.js";

// Create Category
export const createCategoryController = async (req, res) => {
	try {
		const { category } = req.body;

		// Validation
		if (!category) {
			res.status(404).send({
				success: false,
				message: "Please Provide Category Name",
			});
		}

		await categoryModel.create({ category });
		res.status(202).send({
			success: true,
			message: `${category} category created successfully`,
		});
	} catch (error) {
		console.log(error);

		res.status(500).send({
			success: false,
			message: "Error In Create Category API",
			error,
		});
	}
};

// Get all Categories
export const getAllCategoriesController = async (req, res) => {
	try {
		const categories = await categoryModel.find({});

		res.status(200).send({
			success: true,
			message: "Categories Fetch Successfully",
			totalCategories: categories.length,
			categories,
		});
	} catch (error) {
		console.log(error);

		res.status(500).send({
			success: false,
			message: "Error In get All Category API",
			error,
		});
	}
};

// Delete Category
export const deleteCategoryController = async (req, res) => {
	try {
		const category = await categoryModel.findById(req.params.id);

		if (!category) {
			res.status(404).send({
				success: false,
				message: "Category not Found",
			});
		}

		// Find Product with the category
		const products = await productModel.find({ category: category._id });
		// Update Product Category
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			product.category = undefined;
			await product.save();
		}

		await category.deleteOne();

		res.status(200).send({
			success: true,
			message: "Category Deleted Successfully",
		});
	} catch (error) {
		console.log(error);

		// object id error handle
		if (error.name === "CastError") {
			res.status(500).send({
				success: false,
				message: "Invalid Category Id",
				error,
			});
		}

		res.status(500).send({
			success: false,
			message: "Error In Delete Category API",
			error,
		});
	}
};

// Update Category
export const updateCategoryController = async (req, res) => {
	try {
		const category = await categoryModel.findById(req.params.id);
		const { updatedCategory } = req.body;

		if (!category) {
			res.status(404).send({
				success: false,
				message: "Category not Found",
			});
		}

		// Find Product with the category
		const products = await productModel.find({ category: category._id });
		// Update Product Category
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			product.category = updatedCategory;
			await product.save();
		}

		if (updatedCategory) category.category = updatedCategory;

		await category.save();

		res.status(200).send({
			success: true,
			message: "Category Updated Successfully",
		});
	} catch (error) {
		console.log(error);

		// object id error handle
		if (error.name === "CastError") {
			res.status(500).send({
				success: false,
				message: "Invalid Category Id",
				error,
			});
		}

		res.status(500).send({
			success: false,
			message: "Error In Update Category API",
			error,
		});
	}
};

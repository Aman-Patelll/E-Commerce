import productModel from "../models/ProductModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

// Get All Product
export const getAllProductsController = async (req, res) => {
	const { keyword, category } = req.query;

	try {
		const products = await productModel
			.find({
				name: {
					$regex: keyword ? keyword : "",
					$options: "i",
				},
				// category: category ? category : null,
			})
			.populate("category");
		res.status(200).send({
			success: true,
			message: "All Product fetch successfully",
			totalProducts: products.length,
			products,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error In Get All Product API",
			error,
		});
	}
};

// Get Top Product
export const getTopProductsController = async (req, res) => {
	try {
		const products = await productModel.find({}).sort({ rating: -1 }).limit(3);

		res.status(200).send({
			success: true,
			message: "Top 3 Product fetch successfully",
			products,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error In Get Top Product API",
			error,
		});
	}
};

// Get Single Product
export const getSingleProductController = async (req, res) => {
	try {
		// get Product Id
		const product = await productModel.findById(req.params.id);

		// Validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: "Product not found",
			});
		}

		res.status(200).send({
			success: true,
			message: "Product fetch successfully",
			product,
		});
	} catch (error) {
		console.log(error);
		// object id error handle
		if (error.name === "CastError") {
			res.status(500).send({
				success: false,
				message: "Invalid Product Id",
				error,
			});
		}

		res.status(500).send({
			success: false,
			message: "Error In Get Single Product API",
			error,
		});
	}
};

// Create Product
export const createProductController = async (req, res) => {
	try {
		const { name, description, price, stock, category } = req.body;

		// Validation
		if (!name || !description || !price || !stock) {
			res.status(500).send({
				success: false,
				message: "Please provide all feilds",
			});
		}

		if (!req.file) {
			return res.status(500).send({
				success: false,
				message: "Please Provide Product Images",
			});
		}

		const file = getDataUri(req.file);
		const cdb = await cloudinary.v2.uploader.upload(file.content);

		const image = {
			public_id: cdb.public_id,
			url: cdb.secure_url,
		};

		await productModel.create({
			name,
			description,
			price,
			stock,
			category,
			images: [image],
		});

		res.status(201).send({
			success: true,
			message: "Product Created Successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error In Create Product API",
			error,
		});
	}
};

// Update Product
export const updateProductController = async (req, res) => {
	try {
		// get Product Id
		const product = await productModel.findById(req.params.id);

		// Validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: "Product not found",
			});
		}

		const { name, description, price, stock, category } = req.body;

		// Validation
		if (name) product.name = name;
		if (description) product.description = description;
		if (price) product.price = price;
		if (stock) product.stock = stock;
		if (category) product.category = category;

		await product.save();

		res.status(200).send({
			success: true,
			message: "Product Detail Updated Successfully",
		});
	} catch (error) {
		console.log(error);

		// object id error handle
		if (error.name === "CastError") {
			res.status(500).send({
				success: false,
				message: "Invalid Product Id",
				error,
			});
		}

		res.status(500).send({
			success: false,
			message: "Error In Update Product API",
			error,
		});
	}
};

// Update Product Image
export const updateProductImageController = async (req, res) => {
	try {
		// get Product Id
		const product = await productModel.findById(req.params.id);

		// Validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: "Product not found",
			});
		}

		if (!req.file) {
			return res.status(404).send({
				success: false,
				message: "Please Provide Product Images",
				error,
			});
		}

		const file = getDataUri(req.file);
		const cdb = await cloudinary.v2.uploader.upload(file.content);

		const image = {
			public_id: cdb.public_id,
			url: cdb.secure_url,
		};

		product.images.push(image);
		await product.save();

		res.status(200).send({
			success: true,
			message: "Product Image Updated Successfully",
		});
	} catch (error) {
		console.log(error);

		// object id error handle
		if (error.name === "CastError") {
			res.status(500).send({
				success: false,
				message: "Invalid Product Id",
				error,
			});
		}

		res.status(500).send({
			success: false,
			message: "Error In Update Product Image API",
			error,
		});
	}
};

// Delete Product Image
export const deleteProductImageController = async (req, res) => {
	try {
		// get Product Id
		const product = await productModel.findById(req.params.id);

		// Validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: "Product not found",
			});
		}

		// Image id find
		const id = req.query.id;
		if (!id) {
			return res.status(404).send({
				success: false,
				message: "Product Image not found",
			});
		}

		let isExist = -1;
		product.images.forEach((item, index) => {
			if (item._id.toString() === id.toString()) isExist = index;
		});

		if (isExist < 0) {
			return res.status(404).send({
				success: false,
				message: "Image Not Found",
			});
		}

		await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

		product.images.splice(isExist, 1);
		product.save();

		res.status(200).send({
			success: true,
			message: "Product Image Deleted Successfully",
		});
	} catch (error) {
		console.log(error);

		// object id error handle
		if (error.name === "CastError") {
			res.status(500).send({
				success: false,
				message: "Invalid Product Id",
				error,
			});
		}

		res.status(500).send({
			success: false,
			message: "Error In Delete Product Image API",
			error,
		});
	}
};

export const deleteProductController = async (req, res) => {
	try {
		// get Product Id
		const product = await productModel.findById(req.params.id);

		// Validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: "Product not found",
			});
		}

		// find and delte images from cloudinary
		for (let index = 0; index < product.images.length; index++) {
			await cloudinary.v2.uploader.destroy(product.images[index].public_id);
		}

		await product.deleteOne();

		res.status(200).send({
			success: true,
			message: "Product Deleted Successfully",
		});
	} catch (error) {
		console.log(error);

		// object id error handle
		if (error.name === "CastError") {
			res.status(500).send({
				success: false,
				message: "Invalid Product Id",
				error,
			});
		}

		res.status(500).send({
			success: false,
			message: "Error In Delete Product API",
			error,
		});
	}
};

// Create product reviews and comment
export const productReviewController = async (req, res) => {
	try {
		const { comment, rating } = req.body;

		// get Product Id
		const product = await productModel.findById(req.params.id);

		// Check previous reviewa
		const alreadyReviewed = product.reviews.find(
			(r) => r.user.toString() === req.user._id.toString()
		);

		if (alreadyReviewed) {
			return res.status(400).send({
				success: false,
				message: "Product Already Review",
			});
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment: comment,
			user: req.user._id,
		};

		product.reviews.push(review);
		product.numReviews = product.reviews.length;
		product.rating =
			product.reviews.reduce((acc, item) => acc + item.rating, 0) /
			product.reviews.length;

		await product.save();

		res.status(200).send({
			success: true,
			message: "Review Added Successfully",
		});
	} catch (error) {
		console.log(error);

		// object id error handle
		if (error.name === "CastError") {
			res.status(500).send({
				success: false,
				message: "Invalid Id",
				error,
			});
		}

		res.status(500).send({
			success: false,
			message: "Error In Product Review & Comment API",
			error,
		});
	}
};

import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name is require"],
		},
		rating: {
			type: Number,
			default: 0,
		},
		comment: {
			type: String,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: [true, "user require"],
		},
	},
	{ timestamps: true }
);

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, "Product Name is Require"],
		},
		description: {
			type: String,
			require: [true, "Product Description is Require"],
		},
		price: {
			type: Number,
			require: [true, "Product Price is Require"],
		},
		stock: {
			type: Number,
			require: [true, "Product Stock Require"],
		},
		// quantity: {
		// 	type: Number,
		// 	require: [true, "Product Quantity Require"],
		// },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		images: [
			{
				public_id: String,
				url: String,
			},
		],
		reviews: [reviewsSchema],
		rating: {
			type: Number,
			default: 0,
		},
		numReviews: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

export const productModel = mongoose.model("Products", productSchema);
export default productModel;

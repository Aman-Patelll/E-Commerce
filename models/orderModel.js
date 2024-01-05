import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		shippingInfo: {
			address: {
				type: String,
				required: [true, "Address is required"],
			},
			city: {
				type: String,
				required: [true, "City name is required"],
			},
			country: {
				type: String,
				required: [true, "Country is required"],
			},
		},
		orderItems: [
			{
				name: {
					type: String,
					required: [true, "Product name is require"],
				},
				price: {
					type: Number,
					required: [true, "Product price is require"],
				},
				quantity: {
					type: Number,
					required: [true, "Product quantity is require"],
				},
				image: {
					type: String,
					required: [true, "Product image is require"],
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Products",
					required: [true, "Product Id is required"],
				},
			},
		],
		paymentMethod: {
			type: String,
			enum: ["COD", "ONLINE"],
			default: "COD",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: [true, "User Id is required"],
		},
		paidAt: Date,
		paymentInfo: {
			id: String,
			status: String,
		},
		itemPrice: {
			type: Number,
			required: [true, "Item price is required"],
		},
		tax: {
			type: Number,
			required: [true, "Item tax is required"],
		},
		shippingCharges: {
			type: Number,
			required: [true, "Item shippingCharges is required"],
		},
		totalAmount: {
			type: Number,
			required: [true, "Item total price is required"],
		},
		orderStatus: {
			type: String,
			enum: ["processing", "shipped", "delivered"],
			default: "processing",
		},
		deliverAt: Date,
	},
	{ timestamps: true }
);

export const orderModel = mongoose.model("Orders", orderSchema);
export default orderModel;

import productModel from "../models/ProductModel.js";
import orderModel from "../models/orderModel.js";
import { stripe } from "../server.js";

// Create
export const createOrderController = async (req, res) => {
	try {
		const {
			shippingInfo,
			orderItems,
			paymentMethod,
			paymentInfo,
			itemPrice,
			tax,
			shippingCharges,
			totalAmount,
		} = req.body;

		if (
			!shippingInfo ||
			!orderItems ||
			!paymentMethod ||
			!paymentInfo ||
			!itemPrice ||
			!tax ||
			!shippingCharges ||
			!totalAmount
		) {
			res.status(404).send({
				success: false,
				message: "All Information Required",
			});
		}

		// Create Order
		await orderModel.create({
			user: req.user._id,
			shippingInfo,
			orderItems,
			paymentMethod,
			paymentInfo,
			itemPrice,
			tax,
			shippingCharges,
			totalAmount,
		});

		// Stock Update
		for (let i = 0; i < orderItems.length; i++) {
			// Find Product
			const product = await productModel.findById(orderItems[i].product);
			product.stock -= orderItems[i].quantity;
			await product.save();
		}

		res.status(201).send({
			success: true,
			message: "Order Placed Successfully",
		});
	} catch (error) {
		console.log(error);

		res.status(500).send({
			success: false,
			message: "Error In Create Order API",
			error,
		});
	}
};

// Get all order - My Order
export const getMyOrdersController = async (req, res) => {
	try {
		// Find Order
		const orders = await orderModel.find({ user: req.user._id });

		if (!orders) {
			return res.status(404).send({
				success: false,
				message: "Order Not Found",
			});
		}

		res.status(200).send({
			success: true,
			message: "Your Orders Data",
			totalOrders: orders.length,
			orders,
		});
	} catch (error) {
		console.log(error);

		res.status(500).send({
			success: false,
			message: "Error In Get My Order API",
			error,
		});
	}
};

// Get Single order Detail- My Order
export const getSingleOrderDetailController = async (req, res) => {
	try {
		// Find Order
		const order = await orderModel.findById(req.params.id);

		if (!order) {
			return res.status(404).send({
				success: false,
				message: "Order Not Found",
			});
		}

		res.status(200).send({
			success: true,
			message: "Your Order Fetch",
			order,
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
			message: "Error In Get Single Order Detail API",
			error,
		});
	}
};

// Accept Payment
export const paymentController = async (req, res) => {
	try {
		// get amount
		const { totalAmount } = req.body;

		// Validation
		if (!totalAmount) {
			res.status(404).send({
				success: false,
				message: "Total Amount is require",
			});
		}

		const { client_secret } = await stripe.paymentIntents.create({
			amount: Number(totalAmount * 100),
			currency: "usd",
		});

		res.status(200).send({
			success: true,
			message: "Payment Successfull",
			client_secret,
		});
	} catch (error) {
		console.log(error);

		res.status(500).send({
			success: false,
			message: "Error Payment API",
			error,
		});
	}
};

// Admin Section
// Get All Orders
export const getAllOrdersController = async (req, res) => {
	try {
		// Find Order
		const orders = await orderModel.find({});

		if (!orders) {
			return res.status(404).send({
				success: false,
				message: "Orders Not Found",
			});
		}

		res.status(200).send({
			success: true,
			message: "All Orders Data",
			totalOrders: orders.length,
			orders,
		});
	} catch (error) {
		console.log(error);

		res.status(500).send({
			success: false,
			message: "Error In Get All Orders API",
			error,
		});
	}
};

// Change Order Status
export const changeOrderStatusController = async (req, res) => {
	try {
		// Find Order
		const order = await orderModel.findById(req.params.id);

		if (!order) {
			return res.status(404).send({
				success: false,
				message: "Order Not Found",
			});
		}

		if (order.orderStatus === "processing") {
			order.orderStatus = "shipped";
		} else if (order.orderStatus == "shipped") {
			order.orderStatus = "delivered";
			order.deliverAt = Date.now();
		} else {
			return res.status(500).send({
				success: false,
				message: "Order Already Delivered",
			});
		}

		await order.save();

		res.status(200).send({
			success: true,
			message: "Order Status Updated",
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
			message: "Error In Change Order Status Detail API",
			error,
		});
	}
};

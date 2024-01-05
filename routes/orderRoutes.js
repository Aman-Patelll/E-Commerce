import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
	changeOrderStatusController,
	createOrderController,
	getAllOrdersController,
	getMyOrdersController,
	getSingleOrderDetailController,
	paymentController,
} from "../controllers/orderController.js";

const router = express.Router();

// Order Routes
// Create Order
router.post("/create", isAuth, createOrderController);

// Get All Order
router.get("/my-orders", isAuth, getMyOrdersController);

// Get Single Order Detail
router.get("/my-orders/:id", isAuth, getSingleOrderDetailController);

// Accept Payment
router.post("/payment", isAuth, paymentController);

// Admin Part
// Get All Orders
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);

// Change Order Status
router.get("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;

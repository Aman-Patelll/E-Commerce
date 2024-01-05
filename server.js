import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/connectDB.js";

//  dot env config
dotenv.config();

// db connection
connectDB();

// Stripe Configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// Cloudinary Config
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

// Express server
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev")); // for api int erminal
app.use(express.json()); // for accepting json data
app.use(cors());
app.use(cookieParser());

// Route
// routes import
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

app.use("/api/v1/", testRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);

app.get("/", (req, res) => {
	return res.status(200).send("<h1>Welcome to Node server</h1>");
});

app.listen(PORT, () => {
	console.log(
		`Server Running on PORT ${process.env.PORT} on ${process.env.NODE_ENV} Mode`
			.bgMagenta.white
	);
});

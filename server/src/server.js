import express from "express";
import "dotenv/config";
import cors from "cors";
import "./jobs/expireOrdersJob.js";
import { connectDB } from "./config/db.js";

import subscriptionRoutes from "./routes/subscriptions.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import webhookRoutes from "./routes/webhooks.js";
import bannerRoutes from "./routes/banners.js";
const Port = process.env.PORT || 3001;

connectDB();

const app = express();

app.use(cors());

// Razorpay webhook MUST come before express.json()
app.use(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// Normal JSON requests
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.listen(Port, () => {
  console.log("server running");
});
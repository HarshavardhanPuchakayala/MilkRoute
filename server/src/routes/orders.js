import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";

import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

// Customer: own order history
router.get("/mine", protect, getMyOrders);

// Admin: all orders
router.get("/", protect, requireAdmin, getAllOrders);

// Customer: create order
router.post("/", protect, createOrder);

export default router;
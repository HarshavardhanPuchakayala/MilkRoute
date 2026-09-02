import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";

import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/mine", protect, getMyOrders);


router.get("/", protect, requireAdmin, getAllOrders);

router.post("/", protect, createOrder);

export default router;
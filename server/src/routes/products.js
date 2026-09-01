import express from "express";

const router = express.Router();

import { createProduct,updateProduct,deleteProduct,getProduct,getProducts } from "../controllers/productController.js";

import { protect } from "../middleware/auth.js";
import {requireAdmin} from "../middleware/requireAdmin.js";

// Public catalog
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin CRUD
router.post("/", protect, requireAdmin, createProduct);
router.put("/:id", protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

export default router;
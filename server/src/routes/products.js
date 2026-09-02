
import express from "express";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
    getAllProducts,
} from "../controllers/productController.js";

import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ========================================
// Public Catalog
// ========================================

router.get("/", getProducts);
// Admin
router.get("/admin", protect, requireAdmin, getAllProducts);
router.get("/:id", getProduct);

// ========================================
// Admin CRUD
// ========================================

// Create product with image upload
router.post(
  "/",
  protect,
  requireAdmin,
  upload.single("image"),
  createProduct
);

// Update product with optional image upload
router.put(
  "/:id",
  protect,
  requireAdmin,
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  requireAdmin,
  deleteProduct
);

export default router;
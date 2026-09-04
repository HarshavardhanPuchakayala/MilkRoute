import express from "express";

import {
  getBanners,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";

import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getBanners);

router.get("/admin", protect, requireAdmin, getAdminBanners);

router.post(
  "/",
  protect,
  requireAdmin,
  upload.single("image"),
  createBanner
);

router.put(
  "/:id",
  protect,
  requireAdmin,
  upload.single("image"),
  updateBanner
);

router.delete("/:id", protect, requireAdmin, deleteBanner);

export default router;
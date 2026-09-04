import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createSubscription,
  pauseSubscription,
  resumeSubscription,
} from "../controllers/subscriptionController.js";
const router = express.Router();

router.post("/", protect, createSubscription);
router.post("/:subscriptionId/pause", protect, pauseSubscription);
router.post("/:subscriptionId/resume", protect, resumeSubscription);
export default router;
import express from "express";
import { handleRazorpayWebhook } from "../controllers/webhookcontroller.js";

const router = express.Router();

router.post("/", handleRazorpayWebhook);

export default router;
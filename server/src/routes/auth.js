import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.get("/me", protect, (req, res) => res.json({ user: req.user }));
router.post("/signup", signup);
router.post("/login", login);

export default router;
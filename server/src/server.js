import express from "express";
import "dotenv/config";
import cors from "cors";
import  {connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
const Port =process.env.PORT || 3001
connectDB()

const app =express();

app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes)
app.listen(Port ,()=>{
    console.log("server running")
})
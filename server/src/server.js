import express from "express";
import "dotenv/config";
import cors from "cors";
import  {connectDB } from "./config/db.js";

const Port =process.env.PORT || 3001
connectDB()

const app =express();

app.use(express.json())
app.use(cors())

app.listen(Port ,()=>{
    console.log("server running")
})
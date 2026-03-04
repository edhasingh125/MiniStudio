import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDb();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/",(req,res)=>{
    res.send("MiniStudio API runing");
});

const port= 5000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
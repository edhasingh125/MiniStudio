import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";

dotenv.config();
connectDb();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("MiniStudio API runing");
});

const port= 5000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
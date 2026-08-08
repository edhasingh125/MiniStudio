import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import designRoutes from "./routes/designRoutes.js";


dotenv.config();
connectDb();
const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/designs", designRoutes);

app.get("/",(req,res)=>{
    res.send("MiniStudio API runing");
});

const port= 5000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
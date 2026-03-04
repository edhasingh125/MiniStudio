import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Post /api/user/register
router.post("/register",async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message: "User already existis."});
        }

        const hasedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password: hasedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch(error){
        res.status(500).json({message: "Server error"});
    }
});

export default router;
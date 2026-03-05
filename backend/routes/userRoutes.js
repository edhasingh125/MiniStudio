import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

// post /api/users/login
router.post("/login", async (req,res)=>{
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            "secret123",
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch(error){
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
});

export default router;
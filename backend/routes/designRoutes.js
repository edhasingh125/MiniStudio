import express from "express";
import Design from "../models/Design.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// create Design
router.post("/", authMiddleware, async (req, res) => {
  try {

    const design = await Design.create({
      userId: req.user.id,   // user id from token
      title: req.body.title,
      canvasData: req.body.canvasData
    });

    res.status(201).json(design);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// get all design for user
router.get("/",authMiddleware, async (req,res)=>{
    const designs = await Design.find({userId: req.userId});
    res.json(designs);
});

// Delete design
router.delete("/.id",authMiddleware, async (req,res)=>{
    await Design.findByIdAndDelete(req.params.id);
    res.json({message: "Design delete"});
});

export default router;
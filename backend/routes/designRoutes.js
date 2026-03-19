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
import mongoose from "mongoose";

router.get("/", authMiddleware, async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.user.id });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete design
router.delete("/.id",authMiddleware, async (req,res)=>{
    await Design.findByIdAndDelete(req.params.id);
    res.json({message: "Design delete"});
});
// put 
router.put("/:id", async (req, res) => {
  try {
    const { title } = req.body;

    const updatedDesign = await Design.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true } // IMPORTANT
    );

    res.json(updatedDesign);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: "Design deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
import mongoose from "mongoose";
const designSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        canvasData: {
            type: Object,
            required: true
        }
    },{timestamps: true}
);

export default mongoose.model("Design",designSchema);
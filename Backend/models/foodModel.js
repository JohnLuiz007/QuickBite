import mongoose, { mongo } from "mongoose";

const foodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: "" },
        category: { type: String, required: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" }
    }
)

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel;
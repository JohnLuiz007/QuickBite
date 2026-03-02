import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        normalizedName: { type: String, required: true, trim: true, unique: true },
    },
    { timestamps: true }
);

categorySchema.index({ name: 1 });

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;

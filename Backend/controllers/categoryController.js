import categoryModel from "../models/categoryModel.js";
import foodModel from "../models/foodModel.js";

const UNCATEGORIZED_NAME = "Uncategorized";

const normalizeName = (name) => String(name || "").trim().toLowerCase();

const ensureUncategorized = async () => {
  const normalizedName = normalizeName(UNCATEGORIZED_NAME);
  let uncategorized = await categoryModel.findOne({ normalizedName });
  if (!uncategorized) {
    uncategorized = await categoryModel.create({
      name: UNCATEGORIZED_NAME,
      normalizedName,
    });
  }
  return uncategorized;
};

const listCategories = async (req, res) => {
  try {
    await ensureUncategorized();
    const categories = await categoryModel.find({}).sort({ name: 1 });
    return res.json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      return res.json({ success: false, message: "Missing category name" });
    }

    const normalizedName = normalizeName(trimmedName);
    if (normalizedName === normalizeName(UNCATEGORIZED_NAME)) {
      return res.json({ success: false, message: "Category already exists" });
    }

    const existing = await categoryModel.findOne({ normalizedName });
    if (existing) {
      return res.json({ success: false, message: "Category already exists" });
    }

    const category = await categoryModel.create({ name: trimmedName, normalizedName });
    return res.json({ success: true, data: category, message: "Category created" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

const renameCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const trimmedName = String(name || "").trim();

    if (!trimmedName) {
      return res.json({ success: false, message: "Missing category name" });
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    if (normalizeName(category.name) === normalizeName(UNCATEGORIZED_NAME)) {
      return res.json({ success: false, message: "Cannot rename Uncategorized" });
    }

    const newNormalizedName = normalizeName(trimmedName);
    if (newNormalizedName === normalizeName(UNCATEGORIZED_NAME)) {
      return res.json({ success: false, message: "Cannot rename to Uncategorized" });
    }

    const existing = await categoryModel.findOne({ normalizedName: newNormalizedName });
    if (existing && String(existing._id) !== String(category._id)) {
      return res.json({ success: false, message: "Category already exists" });
    }

    const oldName = category.name;

    category.name = trimmedName;
    category.normalizedName = newNormalizedName;
    await category.save();

    await foodModel.updateMany(
      { categoryId: category._id },
      { $set: { category: trimmedName } }
    );

    await foodModel.updateMany(
      { categoryId: { $exists: false }, category: oldName },
      { $set: { category: trimmedName } }
    );

    return res.json({ success: true, data: category, message: "Category renamed" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    if (normalizeName(category.name) === normalizeName(UNCATEGORIZED_NAME)) {
      return res.json({ success: false, message: "Cannot delete Uncategorized" });
    }

    const uncategorized = await ensureUncategorized();

    await foodModel.updateMany(
      { categoryId: category._id },
      { $set: { categoryId: uncategorized._id, category: uncategorized.name } }
    );

    await foodModel.updateMany(
      { categoryId: { $exists: false }, category: category.name },
      { $set: { category: uncategorized.name } }
    );

    await categoryModel.findByIdAndDelete(category._id);

    return res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

export { listCategories, createCategory, renameCategory, deleteCategory, ensureUncategorized };

import foodModel from "../models/foodModel.js";
import categoryModel from "../models/categoryModel.js";
import { ensureUncategorized } from "./categoryController.js";
import fs from 'fs'

// add food items 
const addFood = async (req, res) =>{

    let image_filename = req.file?.filename ? `${req.file.filename}` : "";

    let categoryId = req.body.categoryId;
    let categoryName = req.body.category;
    try {
        if (categoryId) {
            const category = await categoryModel.findById(categoryId);
            if (category) {
                categoryName = category.name;
            } else {
                categoryId = undefined;
            }
        }

        if (!categoryId) {
            if (categoryName) {
                const normalizedName = String(categoryName).trim().toLowerCase();
                const category = await categoryModel.findOne({ normalizedName });
                if (category) {
                    categoryId = category._id;
                    categoryName = category.name;
                }
            }
        }

        if (!categoryId) {
            const uncategorized = await ensureUncategorized();
            categoryId = uncategorized._id;
            categoryName = uncategorized.name;
        }
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
    }

    const food = new foodModel({
        name : req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: categoryName,
        categoryId,
        image: image_filename
    })
    try{
        await food.save()
        res.json({success:true,message:"Food Added"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}

// List of All Food
const listfood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success: true, data: foods})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

const menuGrouped = async (req, res) => {
    try {
        const uncategorized = await ensureUncategorized();

        const [categories, foods] = await Promise.all([
            categoryModel.find({}).sort({ name: 1 }),
            foodModel.find({})
        ]);

        const byCategoryId = new Map();
        for (const food of foods) {
            const key = food.categoryId ? String(food.categoryId) : null;
            if (!byCategoryId.has(key)) byCategoryId.set(key, []);
            byCategoryId.get(key).push(food);
        }

        const groups = categories.map((cat) => {
            const items = byCategoryId.get(String(cat._id)) || [];
            items.sort((a, b) => String(a.name).localeCompare(String(b.name)));
            return {
                _id: cat._id,
                name: cat.name,
                items,
            };
        });

        const categorizedIds = new Set(categories.map((c) => String(c._id)));
        const unknownItems = [];
        for (const [key, items] of byCategoryId.entries()) {
            if (key === null) {
                unknownItems.push(...items);
                continue;
            }
            if (!categorizedIds.has(key)) {
                unknownItems.push(...items);
            }
        }

        if (unknownItems.length > 0) {
            unknownItems.sort((a, b) => String(a.name).localeCompare(String(b.name)));
            const idx = groups.findIndex((g) => String(g._id) === String(uncategorized._id));
            if (idx >= 0) {
                groups[idx] = {
                    ...groups[idx],
                    items: [...groups[idx].items, ...unknownItems],
                };
            } else {
                groups.push({ _id: uncategorized._id, name: uncategorized.name, items: unknownItems });
            }
        }

        return res.json({ success: true, data: { categories: groups, items: foods } });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error" })
    }
}

// Remove food items
const removeFood = async (req, res)=>{
    try {
        const food =await foodModel.findById(req.body.id);
        if (food?.image) {
            fs.unlink(`uploads/${food.image}`,()=>{})
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "food Removed"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

export {addFood, listfood, removeFood, menuGrouped}
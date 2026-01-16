import "dotenv/config";
import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";

const MONGO_URI = process.env.MONGO_DBurl;

if (!MONGO_URI) {
  console.error("Missing env var MONGO_DBurl");
  process.exit(1);
}

const baseMenu = [
  { name: "Greek salad", category: "Salad", price: 12, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg salad", category: "Salad", price: 18, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Clover Salad", category: "Salad", price: 16, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Salad", category: "Salad", price: 24, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Lasagna Rolls", category: "Rolls", price: 14, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Peri Peri Rolls", category: "Rolls", price: 12, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Rolls", category: "Rolls", price: 20, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg Rolls", category: "Rolls", price: 15, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Ripple Ice Cream", category: "Dessert", price: 14, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Fruit Ice Cream", category: "Dessert", price: 22, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Jar Ice Cream", category: "Dessert", price: 10, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vanilla Ice Cream", category: "Dessert", price: 12, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Sandwich", category: "Sandwich", price: 12, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vegan Sandwich", category: "Sandwich", price: 18, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Grilled Sandwich", category: "Sandwich", price: 16, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Bread Sandwich", category: "Sandwich", price: 24, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cup Cake", category: "Cake", price: 14, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vegan Cake", category: "Cake", price: 12, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Butterscotch Cake", category: "Cake", price: 20, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Sliced Cake", category: "Cake", price: 15, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Garlic Mushroom", category: "Pure Veg", price: 14, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Fried Cauliflower", category: "Pure Veg", price: 22, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Mix Veg Pulao", category: "Pure Veg", price: 10, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Rice Zucchini", category: "Pure Veg", price: 12, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cheese Pasta", category: "Pasta", price: 12, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Tomato Pasta", category: "Pasta", price: 18, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Creamy Pasta", category: "Pasta", price: 16, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Pasta", category: "Pasta", price: 24, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Butter Noodles", category: "Noodles", price: 14, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg Noodles", category: "Noodles", price: 12, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Somen Noodles", category: "Noodles", price: 20, description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cooked Noodles", category: "Noodles", price: 15, description: "Food provides essential nutrients for overall health and well-being" },
];

const toPeso = (usdLike) => Math.round(Number(usdLike) * 10);

async function main() {
  await mongoose.connect(MONGO_URI);

  let upserted = 0;
  for (const item of baseMenu) {
    const doc = {
      name: item.name,
      description: item.description,
      category: item.category,
      price: toPeso(item.price),
      image: "",
    };

    const res = await foodModel.findOneAndUpdate(
      { name: doc.name, category: doc.category },
      { $set: doc },
      { upsert: true, new: true }
    );

    if (res) upserted += 1;
  }

  console.log(`Seed complete. Upserted ${upserted} menu items.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});

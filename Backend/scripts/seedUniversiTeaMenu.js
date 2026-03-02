import "dotenv/config";
import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";
import categoryModel from "../models/categoryModel.js";

const normalizeName = (name) => String(name || "").trim().toLowerCase();

const withSizeVariants = (baseName, prices, labels) => {
  return labels.map((label, idx) => ({ name: `${baseName} (${label})`, price: prices[idx] }));
};

const MENU = [
  {
    name: "Milktea Series",
    items: [
      ...withSizeVariants("Cookies & Cream", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Caramel Macchiato", [105, 95], ["Regular", "Large"]),
      ...withSizeVariants("Dark Chocolate", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Matcha", [105, 95], ["Regular", "Large"]),
      ...withSizeVariants("Matcha Oreo", [105, 95], ["Regular", "Large"]),
      ...withSizeVariants("Mocha", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Oreo", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Okinawa", [105, 95], ["Regular", "Large"]),
      ...withSizeVariants("Strawberry", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Taro", [105, 85], ["Regular", "Large"]),
      ...withSizeVariants("Wintermelon", [85, 75], ["Regular", "Large"]),
    ],
  },
  {
    name: "Boba Milk Series",
    items: [
      ...withSizeVariants("Brown Sugar Milk", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Brown Sugar MT", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Brown Sugar Chocolate", [90, 80], ["Regular", "Large"]),
    ],
  },
  {
    name: "Latte Series",
    items: [
      ...withSizeVariants("Matcha Latte", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Strawberry Latte", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Blueberry Latte", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Mulberry Latte", [95, 85], ["Regular", "Large"]),
    ],
  },
  {
    name: "Frappe Series",
    items: [
      ...withSizeVariants("C. Macchiato", [130, 105], ["Regular", "Large"]),
      ...withSizeVariants("Mocha", [130, 105], ["Regular", "Large"]),
    ],
  },
  {
    name: "Fruit Tea Series",
    items: [
      ...withSizeVariants("Lemon", [75, 65], ["Regular", "Large"]),
      ...withSizeVariants("Lychee", [75, 65], ["Regular", "Large"]),
      ...withSizeVariants("Passionfruit", [75, 65], ["Regular", "Large"]),
      ...withSizeVariants("Strawberry", [75, 65], ["Regular", "Large"]),
      ...withSizeVariants("Green Apple", [75, 65], ["Regular", "Large"]),
    ],
  },
  {
    name: "Yakult Fruit Tea",
    items: [
      ...withSizeVariants("Lemon", [90, 75], ["Regular", "Large"]),
      ...withSizeVariants("Lychee", [90, 75], ["Regular", "Large"]),
      ...withSizeVariants("Passionfruit", [90, 75], ["Regular", "Large"]),
      ...withSizeVariants("Strawberry", [90, 75], ["Regular", "Large"]),
      ...withSizeVariants("Green Apple", [90, 75], ["Regular", "Large"]),
    ],
  },
  {
    name: "Popping Boba",
    items: [
      ...withSizeVariants("Popping Lychee", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Popping Strawberry", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Popping Passionfruit", [85, 75], ["Regular", "Large"]),
    ],
  },
  {
    name: "Milkshake Series",
    items: [
      ...withSizeVariants("Cookies & Cream", [75, 65], ["Regular", "Large"]),
      ...withSizeVariants("Choco Banana", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Choco Mango Graham", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Dark Chocolate", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Matcha", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Mango Shake", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Mulberry/Blueberry", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Oreo Mango Graham", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Okinawa", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Strawberry", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Taro", [85, 75], ["Regular", "Large"]),
    ],
  },
  {
    name: "Lemonade",
    items: [
      ...withSizeVariants("Classic Lemonade", [75, 65], ["Regular", "Large"]),
      ...withSizeVariants("Green Pomelo Lemonade", [85, 75], ["Regular", "Large"]),
      ...withSizeVariants("Strawberry Lemonade", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Yakult Lemonade", [95, 85], ["Regular", "Large"]),
      ...withSizeVariants("Red Iced Lemonade", [90, 75], ["Regular", "Large"]),
    ],
  },
  {
    name: "Cold Coffee",
    items: [
      ...withSizeVariants("Americano", [70, 85], ["8oz", "12oz"]),
      ...withSizeVariants("Cappuccino", [85, 95], ["8oz", "12oz"]),
      ...withSizeVariants("Latte", [85, 95], ["8oz", "12oz"]),
      ...withSizeVariants("Caramel Latte Macchiato", [105, 120], ["8oz", "12oz"]),
      ...withSizeVariants("Spanish Latte", [105, 120], ["8oz", "12oz"]),
      ...withSizeVariants("Matcha Latte", [105, 120], ["8oz", "12oz"]),
      ...withSizeVariants("Vanilla Latte Macchiato", [105, 120], ["8oz", "12oz"]),
    ],
  },
  {
    name: "Hot Coffee",
    items: [
      ...withSizeVariants("Hot Latte", [65, 75], ["8oz", "12oz"]),
      ...withSizeVariants("Hot Americano", [55, 65], ["8oz", "12oz"]),
      ...withSizeVariants("Hot Cappuccino", [65, 75], ["8oz", "12oz"]),
    ],
  },
  {
    name: "Flavoured Burger Series (Buffalo / BBQ / Teriyaki)",
    items: [
      { name: "Burger with Cheese", price: 79 },
      { name: "Burger Regular", price: 69 },
    ],
  },
  {
    name: "Combo Series – With Red Lemon Tea",
    items: [
      { name: "Combo 1 – Burger (Burger Regular)", price: 89 },
      { name: "Combo 1 – Burger (Burger w/ Cheese)", price: 99 },
      { name: "Combo 2 – Octo Tako (4 pcs)", price: 80 },
      { name: "Combo 2 – Octo Tako (8 pcs)", price: 130 },
      { name: "Combo 2 – Octo Tako (12 pcs)", price: 180 },
      { name: "Combo 3 – Cheese Tako (4 pcs)", price: 75 },
      { name: "Combo 3 – Cheese Tako (8 pcs)", price: 125 },
      { name: "Combo 3 – Cheese Tako (12 pcs)", price: 175 },
      { name: "Combo 4 – Ham & Cheese (4 pcs)", price: 80 },
      { name: "Combo 4 – Ham & Cheese (8 pcs)", price: 130 },
      { name: "Combo 4 – Ham & Cheese (12 pcs)", price: 180 },
    ],
  },
  {
    name: "Takoyaki Series",
    items: [
      { name: "Takoyaki (4 pcs)", price: 80 },
      { name: "Takoyaki (8 pcs)", price: 155 },
      { name: "Takoyaki (12 pcs)", price: 160 },
    ],
  },
  {
    name: "Add-Ons",
    items: [
      { name: "Espresso (1 Shot)", price: 15 },
      { name: "Oreo", price: 15 },
      { name: "Tapioca", price: 15 },
      { name: "Popping Boba", price: 15 },
      { name: "Nata", price: 15 },
      { name: "Whip Cream", price: 25 },
    ],
  },
];

const MONGO_URI = process.env.MONGO_DBurl;
if (!MONGO_URI) {
  console.error("Missing env var MONGO_DBurl");
  process.exit(1);
}

const ensureCategory = async (name) => {
  const trimmed = String(name).trim();
  const normalizedName = normalizeName(trimmed);

  const existing = await categoryModel.findOne({ normalizedName });
  if (existing) return existing;

  return categoryModel.create({ name: trimmed, normalizedName });
};

const seed = async () => {
  await mongoose.connect(MONGO_URI);

  const uncategorized = await ensureCategory("Uncategorized");

  for (const group of MENU) {
    const category = group?.name ? await ensureCategory(group.name) : uncategorized;

    for (const item of group.items || []) {
      const name = String(item?.name ?? item).trim();
      if (!name) continue;

      const price = Number(item?.price ?? 0);

      const existing = await foodModel.findOne({ name, categoryId: category._id });
      if (existing) {
        await foodModel.updateOne(
          { _id: existing._id },
          {
            $set: {
              price,
              category: category.name,
              categoryId: category._id,
            },
          }
        );
      } else {
        await foodModel.create({
          name,
          description: "-",
          price,
          image: "",
          category: category.name,
          categoryId: category._id,
        });
      }
    }
  }

  console.log("Menu seed complete.");
};

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

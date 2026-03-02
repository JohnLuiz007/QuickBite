import express from "express";
import { createCategory, deleteCategory, listCategories, renameCategory } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/list", listCategories);
categoryRouter.post("/create", createCategory);
categoryRouter.patch("/:id", renameCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;

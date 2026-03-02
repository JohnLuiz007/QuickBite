import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./categories.css";

const Categories = ({ URl }) => {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [renames, setRenames] = useState({});

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [categories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${URl}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.data || []);
        return;
      }
      toast.error(response.data.message || "Error");
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Error";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) {
      toast.error("Enter a category name");
      return;
    }

    try {
      const response = await axios.post(`${URl}/api/category/create`, { name });
      if (response.data.success) {
        setNewName("");
        await fetchCategories();
        toast.success(response.data.message || "Category created");
        return;
      }
      toast.error(response.data.message || "Error");
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Error";
      toast.error(message);
    }
  };

  const onRename = async (categoryId) => {
    const name = (renames[categoryId] || "").trim();
    if (!name) {
      toast.error("Enter a new name");
      return;
    }

    try {
      const response = await axios.patch(`${URl}/api/category/${categoryId}`, { name });
      if (response.data.success) {
        setRenames((prev) => {
          const next = { ...prev };
          delete next[categoryId];
          return next;
        });
        await fetchCategories();
        toast.success(response.data.message || "Category renamed");
        return;
      }
      toast.error(response.data.message || "Error");
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Error";
      toast.error(message);
    }
  };

  const onDelete = async (category) => {
    const ok = window.confirm(`Delete category "${category.name}"? Items will be moved to Uncategorized.`);
    if (!ok) return;

    try {
      const response = await axios.delete(`${URl}/api/category/${category._id}`);
      if (response.data.success) {
        await fetchCategories();
        toast.success(response.data.message || "Category deleted");
        return;
      }
      toast.error(response.data.message || "Error");
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Error";
      toast.error(message);
    }
  };

  return (
    <div className="categories-page add flex-col">
      <p>Categories</p>

      <form className="categories-create" onSubmit={onCreate}>
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      <div className="categories-table">
        <div className="categories-row categories-header">
          <b>Name</b>
          <b>Rename</b>
          <b>Action</b>
        </div>

        {sortedCategories.map((cat) => {
          const isUncategorized = String(cat.name).trim().toLowerCase() === "uncategorized";
          return (
            <div key={cat._id} className="categories-row">
              <p>{cat.name}</p>

              <div className="categories-rename">
                <input
                  type="text"
                  disabled={isUncategorized}
                  placeholder={isUncategorized ? "Protected" : "New name"}
                  value={renames[cat._id] ?? ""}
                  onChange={(e) => setRenames((prev) => ({ ...prev, [cat._id]: e.target.value }))}
                />
                <button type="button" disabled={isUncategorized} onClick={() => onRename(cat._id)}>
                  Rename
                </button>
              </div>

              <button type="button" className="categories-delete" disabled={isUncategorized} onClick={() => onDelete(cat)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;

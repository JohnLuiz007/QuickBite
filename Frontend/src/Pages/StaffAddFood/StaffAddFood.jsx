import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./staffAddFood.module.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const StaffAddFood = () => {
  const { URl, token, fetchFoodList, food_list } = useContext(StoreContext);

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    categoryId: "",
  });

  const sortedFoods = useMemo(() => {
    return [...(food_list || [])].sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")))
  }, [food_list])

  useEffect(() => {
    fetchFoodList?.()

    const loadCategories = async () => {
      const response = await axios.get(`${URl}/api/category/list`, { headers: { token } })
      if (response.data?.success) {
        const list = response.data.data || []
        setCategories(list)
        if (list.length > 0) {
          setData((prev) => {
            if (prev.categoryId) return prev
            const preferred = list.find((c) => String(c?.name || "").toLowerCase() !== "uncategorized") || list[0]
            return { ...prev, categoryId: preferred?._id || "", category: preferred?.name || "" }
          })
        }
        return
      }
      throw new Error(response.data?.message || "Failed to load categories")
    }

    loadCategories().catch(() => {
      setCategories([])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onCategoryChange = (event) => {
    const value = event.target.value;
    const selected = categories.find((c) => c.name === value);
    setData((prev) => ({
      ...prev,
      category: value,
      categoryId: selected?._id || "",
    }));
  }

  const onDeleteFood = async (id) => {
    const ok = window.confirm("Delete this food item?")
    if (!ok) return

    try {
      const response = await axios.post(`${URl}/api/food/remove`, { id }, { headers: { token } })
      if (response.data.success) {
        await fetchFoodList?.()
        alert(response.data.message || "Food removed")
        return
      }
      alert(response.data.message || "Delete failed")
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Delete failed"
      alert(message)
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", String(data.description || "").trim() || "-");
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    if (data.categoryId) {
      formData.append("categoryId", data.categoryId);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(`${URl}/api/food/add`, formData, { headers: { token } });
      if (response.data.success) {
        setData((prev) => ({ name: "", description: "", price: "", category: prev.category, categoryId: prev.categoryId }));
        setImage(null);
        await fetchFoodList?.();
        alert(response.data.message || "Food Added");
        return;
      }
      alert(response.data.message || "Error");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Add food failed";
      alert(message);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Add Food Item</h2>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <div className={styles.row}>
          <label className={styles.label}>Image</label>
          <input className={styles.input} onChange={(e) => setImage(e.target.files?.[0] || null)} type="file" accept="image/*" />
        </div>

        {image ? <img className={styles.preview} src={URL.createObjectURL(image)} alt="preview" /> : null}

        <div className={styles.row}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} onChange={onChangeHandler} value={data.name} type="text" name="name" required />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} onChange={onChangeHandler} value={data.description} name="description" rows="5" placeholder="Optional" />
        </div>

        <div className={styles.grid}>
          <div className={styles.row}>
            <label className={styles.label}>Category</label>
            <select className={styles.input} onChange={onCategoryChange} value={data.category} name="category">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))
              ) : (
                <>
                  <option value="Uncategorized">Uncategorized</option>
                </>
              )}
            </select>
          </div>

          <input type="hidden" name="categoryId" value={data.categoryId} readOnly />

          <div className={styles.row}>
            <label className={styles.label}>Price</label>
            <input className={styles.input} onChange={onChangeHandler} value={data.price} type="number" name="price" required />
          </div>
        </div>

        <button className={styles.button} type="submit">
          Add
        </button>
      </form>

      <h2 className={styles.title}>Current Menu</h2>
      <div className={styles.menuList}>
        {sortedFoods.map((food) => (
          <div key={food._id} className={styles.menuRow}>
            {(() => {
              const placeholders = assets.food_placeholders || [assets.food_placeholder]
              const seed = String(food._id ?? food.name ?? "")
              const idx = Math.abs(seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % placeholders.length
              const fallbackSrc = placeholders[idx] || assets.food_placeholder
              const imageSrc = (!food.image)
                ? fallbackSrc
                : ((typeof food.image === 'string' && (food.image.startsWith('http') || food.image.startsWith('/')))
                  ? food.image
                  : `${URl}/images/${food.image}`)

              return (
                <img
                  className={styles.thumb}
                  src={imageSrc}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = fallbackSrc
                  }}
                />
              )
            })()}
            <div className={styles.menuMeta}>
              <div className={styles.menuName}>{food.name}</div>
              <div className={styles.menuSub}>₱{food.price} · {food.category}</div>
            </div>
            <button className={styles.deleteBtn} type="button" onClick={() => onDeleteFood(food._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffAddFood;

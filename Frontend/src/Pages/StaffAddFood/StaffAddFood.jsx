import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./staffAddFood.module.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const StaffAddFood = () => {
  const { URl, token, fetchFoodList, food_list } = useContext(StoreContext);

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const sortedFoods = useMemo(() => {
    return [...(food_list || [])].sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")))
  }, [food_list])

  useEffect(() => {
    fetchFoodList?.()
  }, [fetchFoodList])

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

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
    if (!image) {
      alert("Please choose an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${URl}/api/food/add`, formData, { headers: { token } });
      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Salad" });
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
          <input className={styles.input} onChange={(e) => setImage(e.target.files?.[0] || null)} type="file" accept="image/*" required />
        </div>

        {image ? <img className={styles.preview} src={URL.createObjectURL(image)} alt="preview" /> : null}

        <div className={styles.row}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} onChange={onChangeHandler} value={data.name} type="text" name="name" required />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} onChange={onChangeHandler} value={data.description} name="description" rows="5" required />
        </div>

        <div className={styles.grid}>
          <div className={styles.row}>
            <label className={styles.label}>Category</label>
            <select className={styles.input} onChange={onChangeHandler} value={data.category} name="category">
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Dessert">Dessert</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

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

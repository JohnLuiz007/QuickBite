import React, { useContext, useState } from "react";
import axios from "axios";
import styles from "./staffAddFood.module.css";
import { StoreContext } from "../../context/StoreContext";

const StaffAddFood = () => {
  const { URl, token } = useContext(StoreContext);

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

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

    const response = await axios.post(`${URl}/api/food/add`, formData, { headers: { token } });
    if (response.data.success) {
      setData({ name: "", description: "", price: "", category: "Salad" });
      setImage(null);
      alert("Food Added");
      return;
    }
    alert(response.data.message || "Error");
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
    </div>
  );
};

export default StaffAddFood;

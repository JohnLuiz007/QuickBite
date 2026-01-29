import React, { useContext } from "react";
import style from "./fooddisplay.module.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className={style.FoodDisplay} id="fooddisplay">
      <h2>Menu</h2>
      <div className={style.FoodDisplayList}>
        {food_list.map((item, index) => {
          if ((category === "All" || category === item.category)) {
        return <FoodItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />;  
        }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;

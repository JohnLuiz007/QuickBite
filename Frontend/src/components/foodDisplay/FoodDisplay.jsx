import React, { useMemo, useState, useContext } from "react";
import style from "./fooddisplay.module.css";
import { StoreContext } from "../../context/StoreContext";

const FoodDisplay = ({ category }) => {
  const { food_list, menu_categories, addToCart } = useContext(StoreContext);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  const groups = useMemo(() => {
    if (Array.isArray(menu_categories) && menu_categories.length > 0) {
      return menu_categories;
    }
    const byName = new Map();
    for (const item of food_list || []) {
      const name = item?.category || "Uncategorized";
      if (!byName.has(name)) byName.set(name, []);
      byName.get(name).push(item);
    }
    const names = Array.from(byName.keys()).sort((a, b) => String(a).localeCompare(String(b)));
    return names.map((name) => {
      const items = byName.get(name) || [];
      items.sort((a, b) => String(a?.name).localeCompare(String(b?.name)));
      return { _id: name, name, items };
    });
  }, [menu_categories, food_list]);

  return (
    <div className={style.FoodDisplay} id="fooddisplay">
      <h2>Menu</h2>
      <div className={style.Accordion}>
        {groups.map((group) => {
          const isOpen = String(openCategoryId) === String(group._id);
          return (
            <div key={group._id} className={style.AccordionItem}>
              <button
                type="button"
                className={style.AccordionHeader}
                onClick={() => setOpenCategoryId(isOpen ? null : group._id)}
              >
                <span className={style.CategoryName}>{group.name}</span>
                <span className={style.ToggleIcon}>{isOpen ? "-" : "+"}</span>
              </button>

              {isOpen ? (
                <div className={style.AccordionBody}>
                  {(group.items || []).map((item) => (
                    <div key={item._id} className={style.MenuRow}>
                      <div className={style.MenuRowMain}>
                        <div className={style.MenuRowTitle}>{item.name}</div>
                        <div className={style.MenuRowDesc}>{item.description}</div>
                      </div>
                      <div className={style.MenuRowRight}>
                        <div className={style.MenuRowPrice}>₱{item.price}</div>
                        <button
                          type="button"
                          className={style.MenuRowAdd}
                          onClick={() => addToCart(item._id, 1)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;

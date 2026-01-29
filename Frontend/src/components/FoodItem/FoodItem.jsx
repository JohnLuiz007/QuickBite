import React, { useContext, useState } from 'react'
import style from './fooditem.module.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

  const { cartItem, addToCart, removeFromCart, URl } = useContext(StoreContext)
  const userRole = localStorage.getItem('userRole') || 'student'

  const placeholders = assets.food_placeholders || [assets.food_placeholder]
  const seed = String(id ?? name ?? "")
  const idx = Math.abs(seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % placeholders.length
  const fallbackSrc = placeholders[idx] || assets.food_placeholder

  const imageSrc = (!image)
    ? fallbackSrc
    : ((typeof image === 'string' && (image.startsWith('http') || image.startsWith('/')))
      ? image
      : (URl + "/images/" + image))

  return (
    <div className={style.FoodItem}>
      <div className={style.FoodItemImageContainer}>
        <img
          className={style.FoodItemImage}
          src={imageSrc}
          alt=""
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = fallbackSrc
          }}
        />
        {userRole === 'staff' ? null : (
          !cartItem[id]
            ? <button className={style.addButton} type="button" onClick={() => addToCart(id)}>Add</button>
            : <div className={style.FoodItemCount}>
              <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="" />
              <p>{cartItem[id]}</p>
              <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="" />
            </div>
        )}
      </div>
      <div className={style.FoodItemInfo}>
        <div className={style.FoodItemName}>
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className={style.FoodItemDescription}>
          {description}
        </p>
        <p className={style.FoodItemPrice}>₱{price}</p>
      </div>
    </div>
  )
}

export default FoodItem
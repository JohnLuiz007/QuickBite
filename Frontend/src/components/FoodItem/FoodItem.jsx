import React, { useContext, useState } from 'react'
import style from './fooditem.module.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

  const { addToCart, URl } = useContext(StoreContext)
  const userRole = localStorage.getItem('userRole') || 'student'
  const [showOk, setShowOk] = useState(false)

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
      </div>
      <div className={style.FoodItemInfo}>
        <h3 className={style.FoodItemTitle}>{name}</h3>
        <p className={style.FoodItemDescription}>{description}</p>

        <div className={style.FoodItemFooter}>
          <p className={style.FoodItemPrice}>₱{price}</p>

          {userRole === 'staff' ? null : (
            showOk
              ? (
                <button
                  className={style.okBtn}
                  type="button"
                  onClick={() => setShowOk(false)}
                >
                  Ok
                </button>
              )
              : (
                <button
                  className={style.addButton}
                  type="button"
                  onClick={async () => {
                    try {
                      await addToCart(id)
                      setShowOk(true)
                    } catch (err) {
                      console.error('Failed to add to cart', err)
                    }
                  }}
                >
                  Add
                </button>
              )
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodItem
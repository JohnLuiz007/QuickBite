import React, { useContext, useState } from 'react'
import style from './fooditem.module.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

  const { addToCart, URl } = useContext(StoreContext)
  const userRole = localStorage.getItem('userRole') || 'student'
  const [showOk, setShowOk] = useState(false)
  const [isQtyModalOpen, setIsQtyModalOpen] = useState(false)
  const [qtyValue, setQtyValue] = useState('1')

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
                  onClick={() => {
                    setQtyValue('1')
                    setIsQtyModalOpen(true)
                  }}
                >
                  Add
                </button>
              )
          )}
        </div>
      </div>

      {isQtyModalOpen ? (
        <div
          className={style.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setIsQtyModalOpen(false)}
        >
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <h4 className={style.modalTitle}>How many?</h4>
            <input
              className={style.qtyInput}
              type="number"
              min="1"
              value={qtyValue}
              onChange={(e) => setQtyValue(e.target.value)}
            />
            <div className={style.modalActions}>
              <button
                className={style.cancelBtn}
                type="button"
                onClick={() => setIsQtyModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={style.confirmBtn}
                type="button"
                onClick={async () => {
                  const qtyNum = Math.max(1, Math.floor(Number(qtyValue) || 1))
                  try {
                    await addToCart(id, qtyNum)
                    setIsQtyModalOpen(false)
                    setShowOk(true)
                  } catch (err) {
                    console.error('Failed to add to cart', err)
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default FoodItem
import React, { useContext, useState } from 'react'
import style from './fooditem.module.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,price,description,image}) => {

    const {cartItem,addToCart,removeFromCart,URl} = useContext(StoreContext)
    const userRole = localStorage.getItem('userRole') || 'student'

  return (
    <div className={style.FoodItem}>
        <div className={style.FoodItemImageContainer}>
            <img className={style.FoodItemImage} src={URl+"/images/"+image} alt="" />
            {userRole === 'staff' ? null : (
                !cartItem[id]
                ?<img className={style.add} onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
                :<div className={style.FoodItemCount}>
                    <img src={assets.remove_icon_red} onClick={()=>removeFromCart(id)}  alt="" />
                    <p>{cartItem[id]}</p>
                    <img src={assets.add_icon_green} onClick={()=>addToCart(id)}  alt="" />
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
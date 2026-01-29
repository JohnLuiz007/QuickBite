import React from 'react'
import style from './header.module.css'

const Header = () => {
  return (
    <div className={style.header}>
        <div className={style.headerContent}>
            <h2>Order your faourite food here</h2>
            <p>Choose from a diverse menu featuring a delectable array of dishes Lorem ipsum dolor sit amet. Lorem ipsum dolor sit.</p>
            <button>View Menu</button>
        </div>
    </div>
  )
}

export default Header


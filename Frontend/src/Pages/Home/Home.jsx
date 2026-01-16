import React from 'react'
import style from './home.module.css'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay'

const Home = () => {
  return (
    <div className={style.a1}>
      <FoodDisplay category={"All"} />
    </div>
  );
}

export default Home
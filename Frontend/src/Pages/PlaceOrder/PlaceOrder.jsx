import { useContext, useEffect, useState } from 'react'
import style from './placeorder.module.css'
import style1 from '../Cart/cart.module.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItem, URl, setCartItems } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItem[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItem[item._id]
        orderItems.push(itemInfo)
      }
    })
    
    let orderData = {
      address: data,
      items: orderItems,
      amount:getTotalCartAmount()
    }
    let response = await axios.post(URl+"/api/order/place", orderData,{headers:{token}})
    if(response.data.success){
      setCartItems({})
      const orderId = response.data.orderId
      navigate(orderId ? `/orders?orderId=${orderId}` : '/orders')
    } else {
      console.log(response.data.message)
      alert("Error")
    }
  }

  const navigate = useNavigate()

  useEffect(()=>{
    if(!token){
      navigate('/cart')
    } else if(getTotalCartAmount() === 0){
      navigate("/cart")
    } 
  },[token])

  return (
    <form onSubmit={placeOrder} className={style.placeOrder}>
      <div className={style.placeOrderLeft}>
        <p className={style.title}>Delivery Details</p>
        <div className={style.multiInputs}>
          <input type="text" name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder='First Name' required/>
          <input type="text" name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder='Last Name' required/>
        </div>
        <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder='Email Address' required/>
        <input type="text" name="street" onChange={onChangeHandler} value={data.street} placeholder='Street' required/>
        <div className={style.multiInputs}>
          <input type="text" name="city" onChange={onChangeHandler} value={data.city} placeholder='City' required/>
          <input type="text" placeholder='State' name="state" onChange={onChangeHandler} value={data.state} required/>
        </div>
        <div className={style.multiInputs}>
          <input type="text" placeholder='Zip Code' name="zipcode" onChange={onChangeHandler} value={data.zipcode} required/>
          <input type="text" placeholder='Country' name="country" onChange={onChangeHandler} value={data.country} required/>
        </div>
        <input type="text" placeholder='Phone Number' name="phone" onChange={onChangeHandler} value={data.phone} required/>
      </div>
      <div className={style.placeOrderRight}>
        <div className={style1.CartTotal}>
          <h2>Cart Total</h2>
          <div>
            <div className={style1.CartTotalDetails}>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className={style1.CartTotalDetails}>
              <b>Total</b>
              <b>${getTotalCartAmount()}</b>
            </div>
          </div>
          <button type='submit'>Proceed To Payment</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
export const StoreContext = createContext(null);
import axios from "axios";

const StoreContextProvider = (props) => {
  const [cartItem, setCartItems] = useState({});
  const URl = (import.meta.env.VITE_API_URL || "http://localhost:4000")
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "")
  const [token , setToken] = useState("")
  const [food_list,setFoodList] = useState([])

  const addToCart =  async (itemId) => {
    if (!cartItem[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      await axios.post(URl+"/api/cart/add", {itemId}, {headers: {token}})
    }

  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(URl+"/api/cart/remove", {itemId}, {headers: {token}})
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItem[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = useCallback(async () => {
    const response = await axios.get(URl + "/api/food/list");
    setFoodList(response.data.data);
  }, [URl]);

  const loadcartData = async (token) => {
    const response = await axios.post(URl+"/api/cart/get",{}, {headers: {token}})
    setCartItems(response.data.cartData)
  }

  // To not logout When refreshed
  useEffect(()=>{
    async function loaddata () {
      await fetchFoodList()
      if(localStorage.getItem("token")){
        const savedToken = localStorage.getItem("token")
        setToken(savedToken)
        const userRole = localStorage.getItem('userRole') || 'student'
        if (userRole !== 'staff') {
          await loadcartData(savedToken);
        }
      }
    }
    loaddata()
  },[fetchFoodList])

  const contextValue = useMemo(() => ({
    food_list,
    fetchFoodList,
    cartItem,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    URl,
    token,
    setToken
  }), [
    food_list,
    fetchFoodList,
    cartItem,
    URl,
    token
  ]);



  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

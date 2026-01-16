import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from "./staffOrders.module.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const StaffOrders = () => {
  const { URl, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(URl + "/api/order/list", { headers: { token } });
    if (response.data.success) {
      setOrders(response.data.data);
      return;
    }
    alert("Error loading orders");
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(
      URl + "/api/order/status",
      {
        orderId,
        status: event.target.value,
      },
      { headers: { token } }
    );

    if (response.data.success) {
      await fetchAllOrders();
      return;
    }
    alert("Failed to update status");
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Staff Orders</h2>
      <div className={styles.list}>
        {orders.map((order) => (
          <div key={order._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <img className={styles.icon} src={assets.parcel_icon} alt="" />
              <div className={styles.meta}>
                <div className={styles.orderId}>Order: {String(order._id).slice(-6)}</div>
                <div className={styles.amount}>₱{order.amount}</div>
              </div>
              <select className={styles.select} onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                <option value="Food is Getting Ready!">Food is Getting Ready!</option>
                <option value="Ready for pickup">Ready for pickup</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className={styles.items}>
              {order.items?.map((item, idx) => (
                <div key={idx} className={styles.itemRow}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemQty}>x{item.quantity}</div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.status}>Status: {order.status}</div>
              <button className={styles.refresh} type="button" onClick={fetchAllOrders}>
                Refresh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffOrders;

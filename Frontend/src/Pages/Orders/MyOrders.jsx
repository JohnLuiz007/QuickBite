import React, { useContext, useMemo, useState, useEffect } from 'react'
import styles from "./myOrder.module.css"
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from "../../assets/assets";
import { useNavigate, useSearchParams } from 'react-router-dom'

const MyOrders = () => {
    const { URl , token } = useContext(StoreContext)
    const [data,setData] = useState([]);
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId')
    const navigate = useNavigate()
    
    const fetchOrders = async ()=>{
        const response = await axios.post(URl+"/api/order/userorders",{},{headers: {token}})
        setData(response.data.data)
        console.log(response.data.data);
    }

    useEffect(()=>{
        if(token){
            fetchOrders()
        }
    },[token])

    const selectedOrder = useMemo(() => {
        if (!orderId) return null
        return data.find((o) => String(o?._id) === String(orderId)) || null
    }, [data, orderId])



  return (
    <div className={styles.myorders}>
        {orderId ? (
            selectedOrder ? (
                <>
                    <h2>Order Details</h2>
                    <div className={styles.detailsCard}>
                        <div className={styles.detailsHeader}>
                            <div className={styles.detailsHeaderLeft}>
                                <img className={styles.detailsIcon} src={assets.parcel_icon} alt="" />
                                <div>
                                    <p className={styles.detailsId}>Order #{String(selectedOrder._id).slice(-6)}</p>
                                    <p className={styles.detailsDate}>{selectedOrder.date ? new Date(selectedOrder.date).toLocaleString() : ''}</p>
                                </div>
                            </div>
                            <p className={styles.detailsStatus}><span>&#x25cf;</span> <b>{selectedOrder.status}</b></p>
                        </div>

                        <div className={styles.detailsSection}>
                            <p className={styles.detailsSectionTitle}>Items</p>
                            <div className={styles.detailsItems}>
                                {(selectedOrder.items || []).map((item, idx) => (
                                    <div key={idx} className={styles.detailsItemRow}>
                                        <p className={styles.detailsItemName}>{item.name}</p>
                                        <p className={styles.detailsItemQty}>x {item.quantity}</p>
                                        <p className={styles.detailsItemPrice}>₱{item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.detailsSection}>
                            <p className={styles.detailsSectionTitle}>Summary</p>
                            <div className={styles.detailsSummaryRow}>
                                <p>Total</p>
                                <p className={styles.detailsAmount}>₱{selectedOrder.amount}.00</p>
                            </div>
                            <div className={styles.detailsSummaryRow}>
                                <p>Number of items</p>
                                <p>{(selectedOrder.items || []).length}</p>
                            </div>
                        </div>

                        <div className={styles.detailsSection}>
                            <p className={styles.detailsSectionTitle}>Delivery / Pickup</p>
                            {selectedOrder.address?.pickupTime ? (
                                <p className={styles.detailsAddressLine}>Pickup time: {selectedOrder.address.pickupTime}</p>
                            ) : (
                                <>
                                    <p className={styles.detailsAddressLine}>{selectedOrder.address?.street || ''}</p>
                                    <p className={styles.detailsAddressLine}>{[selectedOrder.address?.city, selectedOrder.address?.state, selectedOrder.address?.zipcode].filter(Boolean).join(', ')}</p>
                                    <p className={styles.detailsAddressLine}>{selectedOrder.address?.country || ''}</p>
                                    <p className={styles.detailsAddressLine}>{selectedOrder.address?.phone || ''}</p>
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h2>Order Details</h2>
                    <p className={styles.detailsNotFound}>Order not found.</p>
                </>
            )
        ) : (
            <>
                <h2>My Orders</h2>
                <div className={styles.container}>
                    {data.map((order, index)=>{
                        return(
                            <div  key={index} className={styles.myordersOrder}>
                                <img src={assets.parcel_icon} alt="" />
                                <p>{order.items.map((item, index)=>{
                                    if (index === order.items.length - 1) {
                                        return item.name+" x " + item.quantity
                                    } else {
                                        return item.name+" x " + item.quantity + ","
                                    }
                                })}</p>
                                <p>₱{order.amount}.00</p>
                                <p>Items: {order.items.length}</p>
                                <p><span>&#x25cf;</span> <b>{order.status}</b> </p>
                                <button onClick={() => navigate(`/orders?orderId=${order._id}`)}>Track Order</button>
                            </div>
                        )
                    })}
                </div>
            </>
        )}
    </div>
  )
}

export default MyOrders

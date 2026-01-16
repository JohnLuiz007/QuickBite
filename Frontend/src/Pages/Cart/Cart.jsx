import React, { useContext, useMemo, useRef, useState } from "react";
import style from "./cart.module.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';
import Modal from "../../components/Modal/Modal";
import modalStyles from "../../components/Modal/modalContent.module.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Receipt from "../../components/Receipt/Receipt";
import axios from "axios";

const Cart = () => {
  const { cartItem, food_list, removeFromCart, getTotalCartAmount , URl, token, setCartItems } = useContext(StoreContext);

  const navigate = useNavigate();

  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [pickupTime, setPickupTime] = useState("")
  const receiptPreviewRef = useRef(null)

  const pickupSlots = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setMinutes(start.getMinutes() + 15)
    const end = new Date(now)
    end.setMinutes(end.getMinutes() + 120)

    const slots = []
    const cursor = new Date(start)
    cursor.setSeconds(0)
    cursor.setMilliseconds(0)

    while (cursor <= end) {
      const hh = String(cursor.getHours()).padStart(2, "0")
      const mm = String(cursor.getMinutes()).padStart(2, "0")
      slots.push(`${hh}:${mm}`)
      cursor.setMinutes(cursor.getMinutes() + 5)
    }
    return slots
  }, [])

  const receiptItems = useMemo(() => {
    return food_list
      .filter((item) => cartItem[item._id] > 0)
      .map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItem[item._id],
        lineTotal: item.price * cartItem[item._id]
      }))
  }, [food_list, cartItem])

  const receiptTotals = useMemo(() => {
    const subtotal = receiptItems.reduce((acc, it) => acc + it.lineTotal, 0)
    const deliveryFee = subtotal === 0 ? 0 : 5
    const total = subtotal + deliveryFee
    return { subtotal, deliveryFee, total }
  }, [receiptItems])

  const receiptPreviewData = useMemo(() => {
    return {
      createdAt: new Date(),
      host: "CASHIER",
      orderNumber: String(Date.now()).slice(-4),
      pickupTime,
      items: receiptItems,
      subtotal: receiptTotals.subtotal,
      tax: receiptTotals.deliveryFee,
      total: receiptTotals.total,
    }
  }, [receiptItems, receiptTotals, pickupTime])

  const captureCanvas = async (node) => {
    if (!node) return null
    return await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" })
  }

  const downloadPngFromRef = async (ref, filenamePrefix = "receipt") => {
    const canvas = await captureCanvas(ref?.current)
    if (!canvas) return
    const url = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    a.download = `${filenamePrefix}-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const downloadPdfFromRef = async (ref, filenamePrefix = "receipt") => {
    const canvas = await captureCanvas(ref?.current)
    if (!canvas) return

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const finalHeight = Math.min(imgHeight, pageHeight)
    const finalWidth = (canvas.width * finalHeight) / canvas.height
    const x = (pageWidth - finalWidth) / 2
    const y = 24
    pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight)
    pdf.save(`${filenamePrefix}-${Date.now()}.pdf`)
  }

  const openReceiptPreview = () => {
    if (!token) {
      navigate('/auth')
      return
    }
    if (receiptTotals.subtotal === 0) {
      alert("Your cart is empty")
      return
    }
    if (!pickupTime) {
      setPickupTime(pickupSlots[0] || "")
    }
    setIsReceiptOpen(true)
  }

  const confirmCheckout = async () => {
    if (!token) {
      navigate('/auth')
      return
    }

    const orderData = {
      address: {
        pickupTime,
      },
      items: receiptItems.map((it) => ({
        _id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      amount: receiptTotals.total,
    }

    const response = await axios.post(URl + "/api/order/place", orderData, { headers: { token } })
    if (response.data.success) {
      setCartItems({})
      setIsReceiptOpen(false)
      navigate('/orders')
      return
    }
    alert("Checkout failed")
  }

  return (
    <div className={style.Cart}>
      <div className={style.CartItems}>
        <div className={style.CartItemsTitle}>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItem[item._id] > 0) {
            return (
              <div>
                <div
                  className={`${style.CartItemsTitle} ${style.CartItemsItem}`}
                >
                  <img src={URl+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₱{item.price}</p>
                  <p>{cartItem[item._id]}</p>
                  <p>₱{item.price * cartItem[item._id]}</p>
                  <p
                    className={style.Cross}
                    onClick={() => removeFromCart(item._id)}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className={style.CartBottom}>
        <div className={style.CartTotal}>
          <h2>Cart Total</h2>
          <div>
            <div className={style.CartTotalDetails}>
              <p>Subtotal</p>
              <p>₱{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className={style.CartTotalDetails}>
              <p>Delivery Fee</p>
              <p>₱{getTotalCartAmount()===0?0:5}</p> 
            </div> 
            <hr />
            <div className={style.CartTotalDetails}>
              <b>Total</b>
              <b>₱{getTotalCartAmount()===0?0:getTotalCartAmount()+5}</b>
            </div>
          </div>
          <button onClick={openReceiptPreview}>Checkout</button>
        </div>
        <div className={style.CartPromoCode}>
          <div>
            <p>If you have promo code then add here</p>
            <div className={style.CartPromoCodeInput}>
              <input type="text" placeholder="Promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={isReceiptOpen} title="Receipt preview" onClose={() => setIsReceiptOpen(false)}>
        <div className={modalStyles.row}>
          <div>
            <p>Pickup time</p>
          </div>
          <select
            className={modalStyles.qtyInput}
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          >
            {pickupSlots.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className={modalStyles.receiptSpacer}>
          <Receipt
            ref={receiptPreviewRef}
            brand="QuickBite"
            tagline="ORDER RECEIPT"
            addressLines={[]}
            host={receiptPreviewData.host}
            orderNumber={receiptPreviewData.orderNumber}
            pickupTime={receiptPreviewData.pickupTime}
            createdAt={receiptPreviewData.createdAt}
            items={receiptPreviewData.items}
            subtotal={receiptPreviewData.subtotal}
            tax={receiptPreviewData.tax}
            total={receiptPreviewData.total}
            footerLines={["THANK YOU!"]}
          />
        </div>
        <div className={modalStyles.actions}>
          <button className={modalStyles.secondary} type="button" onClick={() => setIsReceiptOpen(false)}>
            Cancel
          </button>
          <button
            className={modalStyles.primary}
            type="button"
            onClick={() => downloadPngFromRef(receiptPreviewRef, "receipt")}
          >
            Download PNG
          </button>
          <button
            className={modalStyles.primary}
            type="button"
            onClick={() => downloadPdfFromRef(receiptPreviewRef, "receipt")}
          >
            Download PDF
          </button>
          <button className={modalStyles.primary} type="button" onClick={confirmCheckout}>
            Confirm checkout
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;

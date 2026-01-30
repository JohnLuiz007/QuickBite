import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"

// Placing user order
const placeOrder = async (req,res) => {

    try{
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })

        await newOrder.save()
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

        res.json({success:true, orderId: newOrder._id})
    } catch(error){
        console.log(error)
        res.json({success: false,message: error})
    }
}

const verifyOrder = async (req, res)=>{
    try {
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

// user Orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId})
        res.json({success: true, data: orders})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}


// All orders for Admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, data:orders})
    } catch (error) {
        console.log(error)
        res.json({success: false, message:"Error"})
    }
}


// Update Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success: true,message: "Status Updated!"})
    } catch (error) {
            console.log(error);
            res.json({success:false,message: "Error"})
            
    }
}

const removeOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId
        if (!orderId) {
            return res.json({ success: false, message: "Missing orderId" })
        }

        const order = await orderModel.findById(orderId)
        if (!order) {
            return res.json({ success: false, message: "Order not found" })
        }

        if (String(order.status) !== "Completed") {
            return res.json({ success: false, message: "Only completed (picked up) orders can be removed" })
        }

        await orderModel.findByIdAndDelete(orderId)
        return res.json({ success: true, message: "Order removed" })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error" })
    }
}

export { placeOrder, verifyOrder, userOrders, updateStatus, listOrders, removeOrder }
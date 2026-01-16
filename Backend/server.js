import express from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";



// app configurations
const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}


//middleware
app.use(express.json()) // For parsing json files coming to backend
app.use(cors()) // To access backend from any frontend


// DB Connection 
connectDB();

// API Endpoint 
app.use("/api/food",foodRouter)
app.use("/images", express.static(uploadsDir))
app.use("/api/user",userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


// Http Requests
app.get('/', (req, res) => {
    res.send("API Working")
});


// To Run on port 4000
app.listen(port,()=>{
    console.log(`Server Running on http://localhost:${port}`)
})
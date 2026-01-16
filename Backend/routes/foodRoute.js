import express from 'express'
import { addFood, listfood, removeFood } from '../controllers/foodController.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const foodRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

//image Storage Engine
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post('/add',upload.single("image"),addFood)
foodRouter.get("/list",listfood)
foodRouter.post("/remove",removeFood)




export default foodRouter;
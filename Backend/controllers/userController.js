// Login and Sign in logic

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


// Login user

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User does not exist!!" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials, Please try again!!" })
        }

        const token = createToken(user._id)
        return res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error " })
    }
}

// Register User

const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET")
    }
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Checking if user exist
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User Already Exist!" })
        }

        //  Validating Email Format and Strong Password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter Valid Email!" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter Strong Password!" })
        }

        // Hashing User password using bcrypt
        const salt = await bcrypt.genSalt(10) //Can be set from 5 to 15 , higher the number higher the hashing 
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

export { loginUser, registerUser }
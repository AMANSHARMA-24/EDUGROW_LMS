import express from "express"
import { changePassword, googleAuth, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.Controller.js";
const authroutes = express.Router();
authroutes.post("/signup" , signUp)
authroutes.post("/signin" , signIn)
authroutes.get("/signout" , signOut)
authroutes.post("/send-otp" , sendOtp)
authroutes.post("/verify-otp" , verifyOtp)
authroutes.post("/reset-password" , changePassword)
authroutes.post("/google-auth" , googleAuth)
export default authroutes;
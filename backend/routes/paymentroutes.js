import express from "express"
import { freeEnroll, razorPayOrder, verifyPayment } from "../controllers/orderController.js";

const paymentRoutes = express.Router();
paymentRoutes.post("/razorpay-order" , razorPayOrder)
paymentRoutes.post("/verifypayment" , verifyPayment)
paymentRoutes.post("/free-enroll" , freeEnroll)

export default paymentRoutes;
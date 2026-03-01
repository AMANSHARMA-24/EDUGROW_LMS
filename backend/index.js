import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import authroutes from "./routes/authroutes.js";
import cors from "cors";
import currentUserroute from "./routes/currentroutes.js";
import courseRouter from "./routes/courseroutes.js";
import paymentRoutes from "./routes/paymentroutes.js";
import reviewRoutes from "./routes/reviewroutes.js";
import searchRoutes from "./routes/searchroute.js";
import adminRoutes from "./routes/adminroutes.js";




dotenv.config()
const port = process.env.PORT || 4000;


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
   origin:"https://edugrow-lms-frontend.onrender.com",
   credentials: true,
}))

app.use("/api/auth" , authroutes)
app.use("/api/user" ,currentUserroute )
app.use("/api/course" ,courseRouter )
app.use("/api/order" , paymentRoutes)
app.use("/api/review" , reviewRoutes)
app.use("/api/search" , searchRoutes)
app.use("/api/admin" , adminRoutes)
app.get("/" , (req,res)=>{
    res.send("hello from server");
})

app.listen(port , ()=>{
    connectDb();
    console.log("Server Started")
})

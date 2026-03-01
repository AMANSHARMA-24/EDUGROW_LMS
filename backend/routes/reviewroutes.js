import express from "express"
import { createReview, getReviews } from "../controllers/review.Controller.js";
import isAuth from "../middleware/isAuth.js";


const reviewRoutes = express.Router();
reviewRoutes.post("/create-review" ,isAuth , createReview)
reviewRoutes.get("/get-reviews/:courseId" , getReviews)


export default reviewRoutes;
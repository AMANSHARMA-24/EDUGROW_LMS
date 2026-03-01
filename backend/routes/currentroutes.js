
import userCurrent, { updateProfile } from "../controllers/user.Controller.js";
import isAuth from "../middleware/isAuth.js";
import express from "express"
import upload from "../middleware/multer.js";
const currentUserroute = express.Router();

currentUserroute.get("/current" ,isAuth,userCurrent);
currentUserroute.post("/profile" ,isAuth,upload.single("image"),updateProfile);

export default currentUserroute;
import express from "express"

import isAuth from "../middleware/isAuth.js";
import { deleteUserByAdmin, getUserForAdmin, removeCourseByAdmin } from "../controllers/admin.Controller.js";


const adminRoutes = express.Router();
adminRoutes.delete("/delete-user/:id" ,isAuth , deleteUserByAdmin)
adminRoutes.get("/get-users",isAuth , getUserForAdmin)
adminRoutes.delete("/remove-course/:courseId" ,isAuth , removeCourseByAdmin)

export default adminRoutes;
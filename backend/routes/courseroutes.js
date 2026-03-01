import express from "express"
import { createCourse, createLecture, editCourses, editLecture, getCourseById, getCourselecture, getCreatorCourses,  getCurrentCreator,  getPublishedCourses, removeCourse, removeLecture } from "../controllers/course.Controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
const courseRouter = express.Router();
courseRouter.post("/create" ,isAuth , createCourse);
courseRouter.get("/getpublised" , getPublishedCourses );
courseRouter.get("/getcreator" ,isAuth, getCreatorCourses );
courseRouter.post("/editcourse/:courseId" ,isAuth, upload.single("thumbnail") ,editCourses);
courseRouter.get("/getcourse/:courseId" ,isAuth, getCourseById );
courseRouter.delete("/remove/:courseId" ,isAuth, removeCourse );
courseRouter.get("/getcreator/:creatorId" , getCurrentCreator );

//LECTURE ROUTES 
courseRouter.post("/createlecture/:courseId" ,isAuth , createLecture);
courseRouter.get("/courselecture/:courseId" ,isAuth , getCourselecture );
courseRouter.post("/editlecture/:lectureId" ,isAuth ,upload.single("videoUrl"),  editLecture );
courseRouter.delete("/removelecture/:lectureId" ,isAuth , removeLecture );


export default courseRouter;
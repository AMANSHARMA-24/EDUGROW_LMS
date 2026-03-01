import razorpay from "razorpay"
import dotenv from "dotenv"
import Course from "../models/courses.model.js";

import User from "../models/user.model.js";
dotenv.config()
const RazorPayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const razorPayOrder = async (req, resp) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return resp.status(404).json({ message: "Course not found" });
        }
        if (course.price <= 0) {
            return resp.status(200).json({ message: "Free course, no payment required", freeCourse: true });
        }
        const options = {
            amount: course.price * 100,
            currency: 'INR',
            receipt: `${courseId}.toString()`,
        }
        const order = await RazorPayInstance.orders.create(options)
        return resp.status(200).json(order);
    } catch (error) {
        return resp.status(500).json({ message: "failed to create Order", error: error.message });
    }
}

// backend/controllers/orderController.js

export const verifyPayment = async (req, resp) =>{
    try {
        const { courseId, userId, razorpay_order_id } = req.body;

        // fetch order info from Razorpay
        const orderInfo = await RazorPayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            // fetch user and course
            const user = await User.findById(userId);
            const course = await Course.findById(courseId).populate("lectures");

            if (!user || !course) {
                return resp.status(404).json({ message: "User or Course not found" });
            }

            // ensure arrays exist
            user.enrollCources = user.enrollCources || [];
            course.enrolledStudents = course.enrolledStudents || [];

            // enroll user if not already
            if (!user.enrollCources.includes(courseId)) {
                user.enrollCources.push(courseId);
                await user.save();
            }

            if (!course.enrolledStudents.includes(userId)) {
                course.enrolledStudents.push(userId);
                await course.save()
            }

            return resp.status(200).json({ message: "Payment verified and enrollment successful" });
        } else {
            return resp.status(400).json({ message: "Payment not completed" });
        }

    } catch (error) {
        
        return resp.status(500).json({ message: `Internal Server Error during Payment: ${error.message}` });
    }
}

// ================= FREE ENROLL CONTROLLER =================
export const freeEnroll = async (req, resp) => {
    try {
        const { userId, courseId } = req.body;

        // Check course
        const course = await Course.findById(courseId);
        if (!course) {
            return resp.status(404).json({ message: "Course not found" });
        }

        // Check if course is free
        if (course.price > 0) {
            return resp.status(400).json({ 
                message: "This course is not free" 
            });
        }

        // Check user
        const user = await User.findById(userId);
        if (!user) {
            return resp.status(404).json({ message: "User not found" });
        }

        // Ensure arrays exist
        user.enrollCources = user.enrollCources || [];
        course.enrolledStudents = course.enrolledStudents || [];

        // Prevent duplicate enrollment
        if (user.enrollCources.includes(courseId)) {
            return resp.status(400).json({
                message: "Already enrolled in this course"
            });
        }

        // Enroll user
        user.enrollCources.push(courseId);
        await user.save();

        course.enrolledStudents.push(userId);
        await course.save();

        return resp.status(200).json({
            message: "Successfully enrolled in free course"
        });

    } catch (error) {
        return resp.status(500).json({
            message: `Free enroll error: ${error.message}`
        });
    }
};
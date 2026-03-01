import Course from "../models/courses.model.js";
import Review from "../models/review.model.js";


export const createReview = async (req, res) => {
  try {
    const { rating, comment, courseId } = req.body;
    const userId = req.userId;

    //  Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    //  Prevent duplicate review by same user
    const existingReview = await Review.findOne({ course: courseId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this course" });
    }

    //  Create the review
    const review = await Review.create({
      user: userId,
      course: courseId,
      rating,
      comment
    });

    
    course.reviews.push(review._id);
    await course.save();

    const populatedReview = await Review.findById(review._id).populate("user", "name email");

    res.status(201).json({review: populatedReview});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error : ${error}` });
  }
}; 


export const getReviews = async (req, res) => {
  try {
    const { courseId } = req.params; // assume you pass courseId as a URL param

    // Find all reviews for the course and populate user info
    const reviews = await Review.find({ course: courseId })
      .populate("user", "name email") // populate name and email from User
      .sort({ createdAt: -1 }); // optional: newest first

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this course" });
    }

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error} `});
  }
};
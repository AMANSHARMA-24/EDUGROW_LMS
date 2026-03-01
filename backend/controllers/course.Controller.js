import uploadOnCloud from "../config/cloudinary.js";
import Course from "../models/courses.model.js";
import Lecture from "../models/lecture.model.js";
import User from "../models/user.model.js";

export const createCourse = async (req, resp) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return resp.status(400).json({ message: "title and category is required" });
    }
    const course = await Course.create({
      title,
      category,
      creator: req.userId,
    })
    return resp.status(201).json(course);
  } catch (error) {
    return resp.status(500).json({ message: `create course error ${error}` });
  }
}

export const getPublishedCourses = async (req, resp) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate("lectures");
    if (!courses) {
      return resp.status(400).json({ message: "courses not found " });
    }
    return resp.status(201).json(courses);
  } catch (error) {
    return resp.status(500).json({ message: `failed to find ispublished Courses ${error}` });
  }
}

export const getCreatorCourses = async (req, resp) => {
  try {
    const userId = req.userId
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return resp.status(400).json({ message: "courses not found " });
    }
    return resp.status(201).json(courses);
  } catch (error) {
    return resp.status(500).json({ message: `failed to find creaator Courses ${error}` });
  }
}

export const editCourses = async (req, resp) => {
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);

  try {
    const { courseId } = req.params;
    const { title, subtitle, description, category, level, isPublished, price } = req.body;


    let thumbnail;

    if (req.file) {
      console.log("Uploading file to cloud:", req.file.path);
      thumbnail = await uploadOnCloud(req.file.path);
      console.log("Cloud URL:", thumbnail);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return resp.status(400).json({ message: "Course not found" });
    }

    // ✅ Update data with optional thumbnail
    const updateData = {
      title,
      subtitle,
      description,
      category,
      level,
      price: Number(price),
      isPublished: isPublished === "true",
      ...(thumbnail && { thumbnail }), // only include if exists
    };

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
    return resp.status(201).json(updatedCourse);

  } catch (error) {
    console.error("Edit course error:", error);
    return resp.status(500).json({ message: `Failed to edit Courses: ${error.message}` });
  }
};


export const getCourseById = async (req, resp) => {
  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);
    if (!course) {
      return resp.status(400).json({ message: "courses not found " });
    }
    return resp.status(200).json(course);
  } catch (error) {
    return resp.status(500).json({ message: `failed to get  Course by id  ${error}` });
  }
}

export const removeCourse = async (req, resp) => {
  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);
    if (!course) {
      return resp.status(400).json({ message: "courses not found " });
    }
    course = await Course.findByIdAndDelete(courseId, { new: true });
    return resp.status(200).json({ message: "Course removed" });
  } catch (error) {
    return resp.status(500).json({ message: `failed to delete Course ${error}` });
  }
}

//FOR LECTURES

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params
    if (!lectureTitle || !courseId) {
      return res.status(400).json({ message: `lecture title is required` });
    }
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id)
    }
    await course.populate("lectures");
    await course.save();
    return res.status(201).json({ lecture, course });
  } catch (error) {
    return res.status(500).json({ message: `failed to create lecture ${error}` });
  }
}

export const getCourselecture = async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId);
    if (!course) {
       return res.status(400).json({ message: `course is not found ` });
    }
    await course.populate("lectures");
    await course.save();
    return res.status(201).json( course ); 
  } catch (error) {
    return res.status(500).json({ message: `failed to get course lecture ${error}` });
  }
}

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params
    const { lectureTitle , isPreviewFree } = req.body;
    const lecture = await Lecture.findById(lectureId);
    if (!lectureId) {
      return res.status(400).json({ message: `lecture not found` });
    }
    let videoUrl
    if(req.file){
      videoUrl = await uploadOnCloud(req.file.path);
      lecture.videoUrl = videoUrl;
    }
    if(lectureTitle){
      lecture.lectureTitle = lectureTitle ;
    }
    if(isPreviewFree){
      lecture.isPreviewFree = isPreviewFree ;
    }
    await lecture.save();
    return res.status(201).json(lecture);
  } catch (error) {
    return res.status(500).json({ message: `failed to edit lecture ${error}` });
  }
}

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    if (!lectureId) {
      return res.status(400).json({ message: "lectureId is required" });
    }

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Remove lecture references from all courses
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({ message: "Lecture removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Failed to remove lecture: ${error}` });
  }
};

export const getCurrentCreator= async (req, resp) => {
  try {
    const {creatorId} = req.params;
    const user = await User.findById(creatorId);
    if (!user) {
      return resp.status(400).json({ message: "creator not found" });
    }
    return resp.status(201).json(user);
  } catch (error) {
    return resp.status(500).json({ message: `failed to find creator user ${error}` });
  }
}
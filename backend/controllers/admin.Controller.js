import Course from "../models/courses.model.js";
import User from "../models/user.model.js";


export const getUserForAdmin = async (req, resp) => {
    
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser || currentUser.role !== "admin") {
      return resp.status(403).json({ message: "Access Denied" });
    }

    
    const users = await User.find().select("-password");

    resp.status(200).json(users);

  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Server Error" });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const { id } = req.params;

    // Admin cannot delete themselves
    if (req.userId === id) {
      return res.status(400).json({ message: "Admin cannot delete himself" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is an educator, delete all their courses
    if (user.role === "educator") {
      await Course.deleteMany({ creator: user._id });
    }

    // Remove user from enrolledStudents in all courses
    await Course.updateMany(
      { enrolledStudents: user._id },
      { $pull: { enrolledStudents: user._id } }
    );

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User and their courses removed successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const removeCourseByAdmin = async (req, resp) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser || currentUser.role !== "admin") {
      return resp.status(403).json({ message: "Access Denied" });
    }
    
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
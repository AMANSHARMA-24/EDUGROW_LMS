import uploadOnCloud from "../config/cloudinary.js";
import User from "../models/user.model.js";

const userCurrent = async (req, resp) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // ✅ await

    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }

    return resp.status(200).json(user); // ✅ plain object
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ message: error.message });
  }
};

export default userCurrent;

export const updateProfile = async (req, resp) => {
  try {
    console.log("IMAGE DEBUG 👉 req.file:", req.file);

    if (req.file) {
      console.log("✔️ Image received");
      console.log("✔️ Image fieldname:", req.file.fieldname);
      console.log("✔️ Image originalname:", req.file.originalname);
      console.log("✔️ Image mimetype:", req.file.mimetype);
      console.log("✔️ Image size (bytes):", req.file.size);
      console.log("✔️ Image path:", req.file.path);
    } else {
      console.log("❌ No image received in request");
    }
    
    const userId = req.userId;
    const { name, description } = req.body;

    const updateData = { name, description };

    if (req.file) {
      const result = await uploadOnCloud(req.file.path);
      updateData.photoUrl = result;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: "-password" } // ✅ updated user + hide password
    );

    if (!user) {
      return resp.status(404).json({ message: "user not found" });
    }

    return resp.status(200).json(user);

  } catch (error) {
    console.log(error);
    return resp.status(500).json({ message: "Server error" });
  }
};

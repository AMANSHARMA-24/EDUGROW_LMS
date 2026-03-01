import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png"; 

function Profile() {

  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setname] = useState(userData.name);
  const [description, setdiscription] = useState(userData.description);
  const [image, setimage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ FIXED
  const handlechange = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${serverUrl}/api/user/profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
      }
      );

      dispatch(setUserData(response.data));
      setIsEditing(false);
      toast.success("Profile updated");

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black to-purple-900 flex items-center justify-center px-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-black px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={image ? URL.createObjectURL(image) : (userData.photoUrl || avatar)}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
          />

          {isEditing && (
            <label className="mt-3 text-sm text-purple-600 font-semibold cursor-pointer">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setimage(e.target.files[0])}
              />
            </label>
          )}
        </div>

        {/* Name */}
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="w-full text-center text-xl font-bold border rounded-lg px-3 py-2 mb-2"
          />
        ) : (
          <h2 className="text-center text-2xl font-bold mb-1">
            {userData.name}
          </h2>
        )}

        {/* Email */}
        <p className="text-center text-gray-500 text-sm mb-4">
          {userData.email}
        </p>

        {/* Description */}
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setdiscription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4 resize-none"
            rows={3}
          />
        ) : (
          <p className="text-center text-gray-700 mb-4">
            {userData.description}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {isEditing ? (
            <button
              onClick={handlechange}   // ✅ FIX
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;



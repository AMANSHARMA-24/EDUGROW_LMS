import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCourse } from "../redux/courseSlice";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();
  const dispatch = useDispatch();
  const categories = [
    "Web Dev",
    "AI & ML",
    "DSA",
    "App Dev",
    "Database",
    "Cloud",
    "Cyber Security",
    "Blockchain",
  ];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !category) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      // 👉 API URL tum yaha change kar dena
      const res = await axios.post( `${serverUrl}/api/course/create`,{
        title,
        category,
      } , {withCredentials:true});

      toast.success("Course created successfully");
      dispatch(addCourse(res.data));
      console.log(res.data);
      setTitle("");
      setCategory("");
      navigate(-1);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black to-purple-900 flex items-center justify-center p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
            >
                ← Back
            </button>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Course
        </h1>

        <form onSubmit={handleCreate} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;

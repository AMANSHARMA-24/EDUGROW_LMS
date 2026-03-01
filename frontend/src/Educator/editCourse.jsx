import React, { useRef, useState, useEffect } from "react";
import { FaReact, FaTrash, FaRocket, FaUpload } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeCourse, updateCourse } from "../redux/courseSlice";


export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  // 🔥 Form States
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isPublished, setisPublished] = useState("false");

  // 📚 Options
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

  const levels = ["Beginner", "Intermediate", "Advanced"];

  // 🔥 Fetch Course Data
  const getCourseById = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      );

      const data = res.data;
      console.log(data);
      setTitle(data?.title || "");
      setSubtitle(data?.subtitle || "");
      setDescription(data?.description || "");
      setCategory(data?.category || "");
      setLevel(data?.level || "");
      setPrice(data?.price || "");
      setisPublished(data?.isPublished || false);

      if (data?.thumbnail) {
        setThumbnail(data.thumbnail);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourseById();
  }, [courseId]);

  // 🖼️ Handle Thumbnail Upload
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
  };

  const handleRemove = async () => {
    const result = confirm("Are You Sure ?")
    if (!result) {
      return;
    }
    try {
      await axios.delete(
        `${serverUrl}/api/course/remove/${courseId}`,
        { withCredentials: true }
      );
      dispatch(removeCourse(courseId));
      alert("Course deleted successfully ✅");
      navigate(-1);

    } catch (error) {
      console.log(error);
    }
  }

  // 💾 Save Changes (Update API ready)
  const handleSave = async () => {
    console.log("Selected file:", fileRef.current?.files[0]);
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", Number(price));
      formData.append("isPublished", isPublished);

      // If user selected a new thumbnail file, append it
      if (fileRef.current?.files[0]) {
        formData.append("thumbnail", fileRef.current.files[0]);
      }

      const res = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // important
          },
        }
      );

      // Update Redux with the new data (except thumbnail URL if backend returns it)
      const updatedData = {
        title,
        subtitle,
        description,
        category,
        level,
        price,
        isPublished,
        ...(res.data.thumbnail && { thumbnail: res.data.thumbnail }),
      };
      dispatch(updateCourse({ id: courseId, data: updatedData }));

      alert("Course updated successfully ✅");
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-b from-black to-purple-900 p-6">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 left-4 bg-gray-400 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>
      <div className="max-w-5xl mx-auto bg-gray-100 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Edit Course
          </h1>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium"
              onClick={handleRemove}>
              <FaTrash /> Remove Course
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 font-medium shadow"
              onClick={() => navigate(`/create-lecture/${courseId}`)}
            >
              Go to Lectures
            </button>

            {isPublished ? <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 font-medium shadow"
              onClick={() => { setisPublished(!isPublished) }}>
              <FaRocket /> Publish
            </button> : <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-800 font-medium shadow"
              onClick={() => { setisPublished(!isPublished) }}>
              <FaRocket /> Publish
            </button>}
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left Fields */}
          <div className="md:col-span-2 space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write course description..."
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Category + Level */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 bg-white"
                >
                  <option value="">Select level</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

          </div>

          {/* Thumbnail Section */}
          <div className="space-y-3">

            <label className="block text-sm font-semibold text-gray-700">
              Course Thumbnail
            </label>

            <div
              onClick={() => fileRef.current?.click()}
              className="relative h-48 w-full rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:border-purple-500 transition"
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="thumbnail"
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <FaUpload className="mx-auto mb-2" />
                  Click to upload
                </div>
              )}

              {/* React Icon */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur p-2 rounded-lg shadow">
                <FaReact className="text-cyan-500" size={18} />
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

          </div>
        </div>

        {/* Save Button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}



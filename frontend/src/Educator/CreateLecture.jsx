import React, { useEffect, useState } from "react";
import { IoArrowBack, IoCreateOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setLectureData } from "../redux/lectureSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle lecture create
  const handleCreateLecture = async (e) => {
    e.preventDefault();
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    try {
      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );

      dispatch(
        setLectureData([
          ...(Array.isArray(lectureData) ? lectureData : []),
          result.data.lecture
        ])
      );
      setLectureTitle("");
      toast.success("Lecture created successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create lecture"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch lectures on mount
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );
        dispatch(setLectureData(res.data.lectures || []));
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch lectures"
        );
      }
    };

    if (courseId) fetchLectures();
  }, [courseId, dispatch]);

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-black to-purple-900 flex flex-col items-center p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white border border-white/20 mb-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-6 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
        >
          <IoArrowBack size={18} /> Back
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">Create Lecture</h1>
        <p className="text-white/80 mb-8">Enter lecture title</p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleCreateLecture}>
          <div>
            <label className="block mb-2 text-sm font-medium">Lecture Title</label>
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter lecture title"
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-purple-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Lecture"}
          </button>
        </form>
      </div>

      {/* Lecture List */}
      <div className="w-full max-w-2xl space-y-4">
        {lectureData && lectureData.length > 0 ? (
          lectureData.map((lecture, index) => (
            <div
              key={lecture._id}
              className="flex items-center justify-between bg-white rounded-xl p-4 text-purple-700 shadow"
            >
              <div className="font-semibold">
                Lecture {index + 1}:&nbsp;&nbsp; {lecture.lectureTitle}
              </div>
              <button className="text-purple-700 hover:text-purple-900 transition"
              onClick ={()=>navigate(`/edit-lecture/${lecture._id}`)}>
                <IoCreateOutline size={20} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-white/80">No lectures yet.</p>
        )}
      </div>
    </div>
  );
}

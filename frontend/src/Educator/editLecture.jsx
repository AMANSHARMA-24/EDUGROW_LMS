import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditLecture() {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const { lectureData } = useSelector((state) => state.lecture);

  const [lectureTitle, setLectureTitle] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  // Prefill data from Redux
  useEffect(() => {
    if (!lectureData || lectureData.length === 0) return;

    const foundLecture = lectureData.find((l) => l._id === lectureId);
    if (foundLecture) {
      setLectureTitle(foundLecture.lectureTitle);
      setIsPreviewFree(foundLecture.isPreviewFree || false);
    }
  }, [lectureData, lectureId]);

  // UPDATE LECTURE
  const handleUpdate = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title cannot be empty");
      return;
    }

    try {
      setLoadingUpdate(true);

      const formData = new FormData();
      formData.append("lectureTitle", lectureTitle);
      formData.append("isPreviewFree", isPreviewFree);
      if (videoFile) formData.append("videoUrl", videoFile);

      await axios.post(`${serverUrl}/api/course/editlecture/${lectureId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lecture updated successfully!");
      setTimeout(() => navigate(-1), 1200);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update lecture");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // REMOVE LECTURE
  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove this lecture?")) return;

    try {
      setLoadingRemove(true);

      await axios.delete(`${serverUrl}/api/course/removelecture/${lectureId}`, {
        withCredentials: true,
      });

      toast.success("Lecture removed successfully!");
      setTimeout(() => navigate(-1), 1200);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove lecture");
    } finally {
      setLoadingRemove(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-linear-to-b from-black to-purple-900">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow space-y-6">
        <h1 className="text-2xl font-bold text-purple-700 text-center">Edit Lecture</h1>

        {/* Lecture Title */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Lecture Title</label>
          <input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          {videoFile && (
            <p className="text-sm text-gray-600 mt-1">Selected: {videoFile.name}</p>
          )}
        </div>

        {/* Preview Free Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPreviewFree}
            onChange={(e) => setIsPreviewFree(e.target.checked)}
          />
          <label className="text-sm font-medium">Is Preview Free</label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUpdate}
            disabled={loadingUpdate || loadingRemove}
            className="flex-1 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 disabled:opacity-50"
          >
            {loadingUpdate ? "Updating..." : "Update Lecture"}
          </button>

          <button
            onClick={handleRemove}
            disabled={loadingUpdate || loadingRemove}
            className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loadingRemove ? "Removing..." : "Remove Lecture"}
          </button>
        </div>
      </div>
    </div>
  );
}
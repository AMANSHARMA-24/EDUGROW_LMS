import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    if (courseData && courseId) {
      const course = courseData.find(
        (course) => course._id === courseId
      );

      setSelectedCourse(course);

      if (course?.lectures?.length > 0) {
        setSelectedLecture(course.lectures[0]);
      }
    }
  }, [courseId, courseData]);

  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading Course...
      </div>
    );
  }

  const currentIndex = selectedCourse.lectures.findIndex(
    (lec) => lec._id === selectedLecture?._id
  );

  const progress =
    ((currentIndex + 1) / selectedCourse.lectures.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-l from-black to-purple-900 p-4 sm:p-6 relative">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-4 sm:p-6">

          {/* COURSE TITLE */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedCourse.title}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {selectedCourse.subtitle}
            </p>
          </div>

          {/* VIDEO */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
            {selectedLecture?.videoUrl ? (
              <video
                key={selectedLecture._id}
                src={selectedLecture.videoUrl}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                No Video Available
              </div>
            )}
          </div>

          {/* LECTURE TITLE */}
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-5">
            {selectedLecture?.lectureTitle}
          </h2>

          {/* LECTURE DETAILS */}
          <div className="text-xs sm:text-sm text-gray-500 mt-2">
            Created on:{" "}
            {new Date(selectedLecture?.createdAt).toLocaleDateString()}
            {selectedLecture?.isPreviewFree && (
              <span className="ml-3 text-green-600 font-medium">
                • Free Preview
              </span>
            )}
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-6">
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span>Course Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div
                className="bg-indigo-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* COURSE DESCRIPTION */}
          <div className="mt-8 border-t pt-5">
            <h3 className="text-lg font-semibold mb-2">
              About this Course
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {selectedCourse.description}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 max-h-[70vh] lg:max-h-[85vh] overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-5 text-gray-800">
            Course Content
          </h2>

          {selectedCourse.lectures.map((lecture, index) => (
            <div
              key={lecture._id}
              onClick={() => setSelectedLecture(lecture)}
              className={`p-3 sm:p-4 mb-3 rounded-xl cursor-pointer transition-all duration-200 text-sm sm:text-base ${
                selectedLecture?._id === lecture._id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>
                  {index + 1}. {lecture.lectureTitle}
                </span>

                {lecture.isPreviewFree && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                    Free
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ViewLecture;
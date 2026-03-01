import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function MyEnrolledCourses() {
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const { courseData } = useSelector((state) => state.course);

  const enrolledCourses =
    courseData?.filter((course) =>
      userData?.enrollCources?.includes(course._id.toString())
    ) || [];

  return (
    <div className="min-h-screen p-6 bg-linear-to-l from-black to-purple-900">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        My Enrolled Courses
      </h1>

      {enrolledCourses.length === 0 ? (
        <div className="flex justify-center items-center h-60 text-lg font-semibold text-white">
          No Enrolled Courses Yet 📚
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              {/* Content */}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-900">
                  {course.title}
                </h2>

                <p className="text-sm text-gray-700 mb-2">
                  {course.subtitle}
                </p>

                <p className="text-xs text-gray-500 mb-4">
                  Level: {course.level}
                </p>

                {/* Watch Now Button */}
                <button
                  onClick={() => navigate(`/viewlectures/${course._id}`)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                >
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEnrolledCourses;
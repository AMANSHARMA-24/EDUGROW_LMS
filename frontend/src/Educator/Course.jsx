import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Course() {
  const navigate = useNavigate();
  const { CreatorCourses } = useSelector((state) => state.course);

  return (
    <div className="relative bg-linear-to-b from-black to-purple-900">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white/20 backdrop-blur-md text-black px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>
      <div className="p-4 sm:p-6 bg-linear-to-l from-black to-purple-900 min-h-screen ">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pt-6 sm:pt-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt=5">
            My Courses
          </h1>

          <button
            className="px-5 py-2 text-white font-medium text-1.5xl rounded-lg
          bg-linear-to-r from-purple-400 to-purple-500
          hover:from-purple-600 hover:to-purple-800 transition"
            onClick={() => navigate("/create-courses")}
          >
            Create Courses
          </button>
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left border-collapse">

            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-2xl font-semibold">Courses</th>
                <th className="p-4 text-2xl font-semibold">Price</th>
                <th className="p-4 text-2xl font-semibold">Status</th>
                <th className="p-4 text-2xl font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {CreatorCourses?.length > 0 ? (
                CreatorCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-t hover:bg-purple-100"
                  >
                    {/* Course */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={course.thumbnail}
                          alt="thumbnail"
                          className="w-16 h-12 object-cover rounded"
                        />

                        <div>
                          <div className="font-medium">
                            {course.title || "Untitled Course"}
                          </div>

                          <div className="text-xs text-gray-500">
                            {course.category || "General"}
                            {course.level ? ` • ${course.level}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {course.price ? `₹${course.price}` : "NA"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${course.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() =>
                          navigate(`/edit-course/${course._id}`)
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="md:hidden space-y-10">
          {CreatorCourses?.length > 0 ? (
            CreatorCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow p-4 flex gap-4"
              >
                <img
                  src={course.thumbnail}
                  alt="thumbnail"
                  className="w-20 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">
                    {course.title || "Untitled Course"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {course.category || "General"}
                    {course.level ? ` • ${course.level}` : ""}
                  </p>

                  <p className="mt-1 font-medium">
                    {course.price ? `₹${course.price}` : "Free"}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${course.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>

                    <button
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      onClick={() =>
                        navigate(`/edit-course/${course._id}`)
                      }
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white">
              No courses found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Course;




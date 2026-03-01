import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

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

function AllCourses() {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleCheckboxChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredCourses =
    selectedCategories.length > 0
      ? courseData.filter((course) =>
          selectedCategories.includes(course.category)
        )
      : courseData;

  return (
    <div className="min-h-screen flex bg-linear-to-l from-black to-purple-900 relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-72 p-6  bg-black/60 backdrop-blur-lg text-gray-200 shadow-lg">
        <h2 className="font-bold text-3xl mb-15 mt-5">Categories</h2>
        <h3 className="font-bold text-xl mb-6">Filter:</h3>
        <div className="flex flex-col space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-3 cursor-pointer hover:text-gray-400 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCheckboxChange(category)}
                className="w-5 h-5 accent-purple-500"
              />
              <span className="text-lg">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-54 p-6  bg-black/60 backdrop-blur-lg text-gray-200 transform ${
          showMobileSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 shadow-lg`}
      >
        <button
          className="mb-6 text-white font-bold"
          onClick={() => setShowMobileSidebar(false)}
        >
          Close
        </button>
        <h2 className="font-bold text-3xl mb-15">Categories</h2>
        <h2 className="font-semibold text-xl mb-6">Filter :</h2>
        <div className="flex flex-col space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-2 cursor-pointer hover:text-gary-200 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCheckboxChange(category)}
                className="w-4 h-4 accent-purple-500"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-0">
        {/* Back button */}
        <button
          className="flex items-center text-gray-100 mb-6 font-semibold text-xl hover:text-gray-300 transition-colors"
          onClick={() => navigate(-1)}
        >
          <IoArrowBack className="mr-2 text-2xl" />
          Back
        </button>

        {/* Mobile Hamburger */}
        <div className=" flex items-center md:hidden mb-6">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="bg-purple-600 p-3 rounded-full text-white shadow-lg hover:scale-105 transition-transform"
          >
            <FaBars className="text-2xl" />
          </button>
          <h2 className=" text-gray-200 font-semibold ml-3 text-xl">Filter</h2>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-100">
          All Courses
        </h1>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-200  rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300"

              >
                <Card
                  thumbnail={course.thumbnail}
                  title={course.name}
                  category={course.category}
                  price={course.price}
                  courseId = {course._id}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">No courses available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllCourses;





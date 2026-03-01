import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";

function CardPage() {
  const { courseData } = useSelector((state) => state.course);

  return (
    <div className="p-8 bg-linear-to-b from-indigo-50 to-indigo-300 min-h-screen">
      
      
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-3">
          Explore Our Top Courses
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Unlock your potential and gain new skills with our handpicked courses designed to help you grow and succeed.
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {courseData && courseData.length > 0 ? (
          courseData.map((course) => (
            <div
              key={course._id}
              className="relative h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {/* Card */}
              <Card
                thumbnail={course.thumbnail}
                title={course.title}
                category={course.category}
                price={course.price}
                courseId = {course._id}
              />

              
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No courses available
          </p>
        )}
      </div>
    </div>
  );
}

export default CardPage;


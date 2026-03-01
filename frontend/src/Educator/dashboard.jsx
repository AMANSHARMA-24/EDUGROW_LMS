import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function Dashboard() {
  const { CreatorCourses } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const name = userData?.name || "User";
  const email = userData?.email || "user@email.com";
  const photo = userData?.photoUrl;
  const firstLetter = name.charAt(0).toUpperCase();

  //Calculating total earning
  // Ensure price is a number
const totalearning = CreatorCourses?.reduce((acc, course) => {
  const enrolledCount = course.enrolledStudents?.length || 0;
  const price = Number(course.price) || 0; // Convert price to number, fallback to 0
  return acc + enrolledCount * price;
}, 0);

  // Prepare combined chart data
  const chartData = CreatorCourses?.map((course) => ({
    name: course.title,
    enrolled: course.enrolledStudents?.length || 0,
  }));

  return (
    <div className="min-h-screen bg-linear-to-b from-black to-purple-900 p-4 md:p-10 relative">
      {/* ===== BACK BUTTON ===== */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>

      {/* ===== GRID ===== */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-15">
        {/* ================= LEFT : MAIN PROFILE ================= */}
        <div className="bg-gray-100 rounded-3xl shadow-2xl p-8 text-center">
          {photo ? (
            <img
              src={photo}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-purple-500 mb-5"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white mx-auto border-4 border-purple-500 flex items-center justify-center text-4xl font-bold text-purple-700 mb-5">
              {firstLetter}
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-500 mt-1">{email}</p>

          <div className="mt-6">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-3xl font-bold text-purple-700">₹ {totalearning}</p>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="mt-6 w-full bg-linear-to-r from-purple-600 to-purple-800 text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Create Courses
          </button>
        </div>

        {/* ================= RIGHT : COMBINED CHART ================= */}
        <div className="lg:col-span-2 bg-gray-100 rounded-3xl shadow-2xl p-2">
            <h1 className="text-2xl font-bold text-gray-800">Student Enrolled</h1>
          {chartData && chartData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="enrolled" fill="#7c3aed"  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-xl font-semibold text-gray-700">No Courses Found</p>
              <p className="mt-2 text-sm">Create courses to see analytics here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


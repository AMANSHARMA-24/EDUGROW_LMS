import React from "react";
import Navbar from "../components/navbar";
import backgroundimage from "../assets/backgroundimage.jpeg";
import { FaRobot, FaBookOpen } from "react-icons/fa";
import Explore from "../components/explore";
import CardPage from "../components/CardPage";
import { useNavigate } from "react-router-dom";
import About from "../components/About";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { FaUserShield } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const {userData} = useSelector(state => state.user) 
  return (
    <div className="w-full">

      {/* Hero Section */}
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundimage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/65"></div>

        {/* Navbar */}
        <div className="relative z-20">
          <Navbar />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center pt-40 min-h-[calc(100vh-64px)] px-4 text-center">
          <h1 className="text-white font-bold leading-tight mb-10">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl sm:-translate-x-10 md:-translate-x-14">
              Learning Today
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl sm:translate-x-6 md:translate-x-10">
              Leading Tomorrow
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:scale-105"
              onClick={() => navigate("/allcourses")}
            >
              <FaBookOpen />
              View All Courses
            </button>

            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/90 hover:bg-white text-purple-700 font-semibold transition-all duration-300 shadow-lg hover:scale-105"
            onClick = {()=>navigate("/search")}>
              <FaRobot className="text-xl" />
              Search with AI
            </button>

            {(userData?.role === "admin")&&
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/90 hover:bg-red-600 text-white font-semibold transition-all duration-300 shadow-lg hover:scale-105"
            onClick = {()=>navigate("/admin")}>
              <FaUserShield className="text-xl" />
              Admin pannel
            </button>
            }
          </div>
        </div>

        {/* ================== Features Cards inside Hero ================== */}
        <div className="relative bottom-30 mt-0 sm:mt-4">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg transition-transform duration-200 hover:shadow-2xl hover:-translate-y-2">
              <FaBookOpen className="mx-auto text-purple-600 text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Expert-Led Courses</h3>
              <p className="text-gray-600 text-sm">
                Learn from industry experts and enhance your skills with practical projects.
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2">
              <FaRobot className="mx-auto text-purple-600 text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-2">AI-Powered Learning</h3>
              <p className="text-gray-600 text-sm">
                Personalized learning paths and AI-driven recommendations for faster growth.
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2">
              <FaBookOpen className="mx-auto text-purple-600 text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Flexible & Affordable</h3>
              <p className="text-gray-600 text-sm">
                Learn at your own pace from anywhere, with courses that suit every budget.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Section */}
      <Explore />

      {/* Other Sections */}
      <CardPage />
      <About />
      <Footer />
    </div>
  );
}

export default Home;









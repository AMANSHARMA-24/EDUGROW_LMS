import React from "react";
import {
  FaLaptopCode,
  FaMobileAlt,
  FaDatabase,
  FaCloud,
} from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { TbBinaryTree } from "react-icons/tb";
import { SiCyberdefenders, SiBlockchaindotcom } from "react-icons/si";
import { useNavigate } from "react-router-dom";

function Explore() {
  const fields = [
    { name: "Web Dev", icon: <FaLaptopCode />, color: "text-blue-500" },
    { name: "AI & ML", icon: <GiArtificialIntelligence />, color: "text-purple-500" },
    { name: "DSA", icon: <TbBinaryTree />, color: "text-green-500" },
    { name: "App Dev", icon: <FaMobileAlt />, color: "text-pink-500" },
    { name: "Database", icon: <FaDatabase />, color: "text-yellow-500" },
    { name: "Cloud", icon: <FaCloud />, color: "text-sky-500" },
    { name: "Cyber Security", icon: <SiCyberdefenders />, color: "text-red-500" },
    { name: "Blockchain", icon: <SiBlockchaindotcom />, color: "text-indigo-500" },
  ];
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-10 px-6 md:px-16 overflow-hidden">
      
      {/* Fixed Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-400 via-purple-100 to-blue-100 z-0"></div>

      {/* Soft Glow Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full blur-2xl opacity-20 z-0"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300 rounded-full blur-2xl opacity-20 z-0"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 z-10">

        {/* Left Section */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Explore Our Courses
          </h1>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            Discover in-demand tech fields and start building real-world skills.
            From development to AI and cloud technologies, we provide structured
            learning paths to make you industry-ready.
          </p>

          <button className="px-7 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:scale-105 transition duration-300"
          onClick ={()=>navigate("/allcourses")}>
            Explore Courses
          </button>
        </div>

        {/* Right Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 
                         bg-white/80 backdrop-blur-sm 
                         rounded-2xl shadow-lg 
                         hover:shadow-2xl hover:-translate-y-2 
                         transition duration-300 cursor-pointer"
            >
              <div className={`text-5xl mb-4 ${field.color}`}>
                {field.icon}
              </div>
              <p className="font-semibold text-gray-700 text-center">
                {field.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Explore;




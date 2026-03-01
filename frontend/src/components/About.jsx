import React from "react";
import aboutImage from "../assets/aboutImage.jpg"; 

function About() {
  return (
    <div className="flex items-center justify-center p-2 min-h-[60vh]">
      <div className="bg-white/90 rounded-3xl shadow-xl flex flex-col-reverse md:flex-row overflow-hidden max-w-4xl">
        
        {/* Left Side Image */}
        <div className="md:w-1/2 h-48 md:h-auto">
          <img
            src={aboutImage}
            alt="About"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side Content */}
        <div className="md:w-1/2 p-4 flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            About Us
          </h2>

          <p className="text-gray-700 mb-2 leading-relaxed text-sm md:text-base">
            Welcome to EduGrow! Our mission is to empower learners with high-quality courses and a modern, interactive learning experience. We focus on making education accessible and enjoyable for everyone.
          </p>

          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            Our platform provides courses in web development, AI, data science, and more. We aim to create a community of learners who grow together and achieve their goals efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
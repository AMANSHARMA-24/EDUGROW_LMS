import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // All possible links
  const links = [
    { name: "Home", path: "/", protected: false },
    { name: "Sign Up", path: "/signup", protected: false },
    { name: "Sign In", path: "/signin", protected: false },
    { name: "Profile", path: "/profile", protected: true },
    { name: "My Courses", path: "/my-courses", protected: true },
    { name: "Forgot Password", path: "/forgot", protected: false },
    { name: "Dashboard", path: "/dashboard", protected: true, role: "educator" },
    { name: "Courses", path: "/courses", protected: true, role: "educator" },
    { name: "Create Course", path: "/create-courses", protected: true, role: "educator" },
    { name: "All Courses", path: "/allcourses", protected: false },
  ];

  // Filter links based on userData
  const visibleLinks = links.filter((link) => {
    if (!link.protected) return true; // public links always visible
    if (link.protected && !userData) return false; // hide if user not logged in
    if (link.role && userData?.role !== link.role) return false; // role mismatch
    return true;
  });

  // Handle navigation
  const handleNavigate = (path) => {
    navigate(path, { replace: false }); // push to history
  };

  return (
    <footer className="bg-black text-gray-200 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo / Brand */}
        <div className="mb-4 md:mb-0">
          <h2
            className="text-xl font-bold cursor-pointer hover:text-purple-400 transition-colors"
            onClick={() => navigate("/")}
          >
            EduGrow
          </h2>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          {visibleLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigate(link.path)}
              className="hover:text-purple-400 transition-colors text-sm md:text-base"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-4 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} EduGrow. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
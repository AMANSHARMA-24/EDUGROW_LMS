import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import navlogo from "../assets/navlogo2.jpeg"; 

function Navbar() {
  const userdata = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);        // mobile
  const [profileOpen, setProfileOpen] = useState(false); // desktop avatar

  const isLoggedIn = Boolean(userdata?._id);
  const firstLetter = isLoggedIn ? userdata.name.charAt(0).toUpperCase() : "";

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("Logged out successfully 👋", { autoClose: 2000 });
      setMenuOpen(false);
      setProfileOpen(false);
      navigate("/");
    } catch {
      toast.error("Logout failed ❌");
    }
  };

  return (
   <nav className="w-full h-16 px-6 flex items-center justify-between bg-linear-to-r from-black to-purple-900 opacity-90 shadow-md relative text-white">
  {/* LEFT */}
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-full flex items-center justify-center">
  <img 
    src={navlogo} 
    alt="LOGO" 
    className="w-full h-full object-contain rounded-full"
  />
</div>
    <span className="text-xl font-bold text-white">EduGrow</span>
  </div>

  {/* DESKTOP RIGHT */}
  <div className="hidden md:flex items-center gap-5 relative">
    {/* Dashboard for educators only */}
    {isLoggedIn && userdata.role === "educator" && (
      <button
        onClick={() => navigate("/dashboard")}
        className="text-white font-medium hover:text-indigo-400"
      >
        Dashboard
      </button>
    )}

    {!isLoggedIn ? (
      <button
        onClick={() => navigate("/signin")}
        className="px-5 py-2 rounded-md bg-orange-500 text-white text-sm hover:bg-orange-600"
      >
        Sign In
      </button>
    ) : (
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-md bg-orange-500 text-white text-sm hover:bg-orange-600"
      >
        Sign Out
      </button>
    )}

    {/* Avatar */}
    {isLoggedIn && (
      <div className="relative">
        <div
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold cursor-pointer"
        >
          {firstLetter}
        </div>

        {/* Avatar Dropdown */}
        <div
          className={`absolute right-0 top-14 w-48 bg-gray-800 text-white rounded-md shadow-lg p-3
          transform transition-all duration-200 origin-top
          ${
            profileOpen
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => {
              navigate("/profile");
              setProfileOpen(false);
            }}
            className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 transition"
          >
            My Profile
          </button>

          <button
            onClick={() => {
              navigate("/my-courses");
              setProfileOpen(false);
            }}
            className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 transition"
          >
            Enrolled Courses
          </button>
        </div>
      </div>
    )}
  </div>

  {/* MOBILE HAMBURGER */}
  <button
    className="md:hidden text-2xl"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    ☰
  </button>

  {/* MOBILE MENU */}
  <div
    className={`absolute top-16 right-4 w-48 bg-gray-900 bg-opacity-95 text-white rounded-md shadow-lg p-4 md:hidden z-50
    transform transition-all duration-300 origin-top
    ${
      menuOpen
        ? "scale-100 opacity-100"
        : "scale-95 opacity-0 pointer-events-none"
    }`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
        {isLoggedIn ? firstLetter : "👤"}
      </div>
      <span className="text-white font-medium">
        {isLoggedIn ? userdata.name : "Guest"}
      </span>
    </div>

    {/* STACKED MENU */}
    <div className="flex flex-col gap-2">
      {/* Dashboard only for educators */}
      {isLoggedIn && userdata.role === "educator" && (
        <button
          onClick={() => {
            navigate("/dashboard");
            setMenuOpen(false);
          }}
          className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 transition"
        >
          Dashboard
        </button>
      )}

      {isLoggedIn ? (
        <>
          <button
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 transition"
          >
            My Profile
          </button>

          <button
            onClick={() => {
              navigate("/my-courses");
              setMenuOpen(false);
            }}
            className="w-full text-left py-2 px-2 rounded hover:bg-gray-700 transition"
          >
            Enrolled Courses
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-2 rounded text-orange-400 hover:bg-orange-800 transition"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            navigate("/signin");
            setMenuOpen(false);
          }}
          className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Sign In
        </button>
      )}
    </div>
  </div>
</nav>

  );
}

export default Navbar; 








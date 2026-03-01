import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import EdugrowLogo from "../assets/edugrowlogo.png";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      
      dispatch(setUserData(result.data));
      toast.success("Login Successful 🎉");
      navigate("/"); // ya dashboard route
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async ()=>{
          try{
             const response = await signInWithPopup(auth , provider)
             let user =response.user;
             let name = user.displayName;
             let email = user.email;
             let role = "";
             
             const result = await axios.post(`${serverUrl}/api/auth/google-auth` , {name , email , role}  , 
              {withCredentials:true})
              console.log(result.data.user)
             dispatch(setUserData(result.data.user));
              setLoading(false)
              navigate("/")
              toast.success("Signin Successfully") 
          }catch(error){
             console.log(error);
             toast.error(
                  error?.response?.data?.message || "Something went wrong"
              );
          }
      }
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-black to-purple-900 p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-black px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>
      <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 ">

        {/* Left Side – Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Welcome Back !
          </h2>
          <p className="text-gray-500 mb-6">
            Login to continue your journey
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <FaLock className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <span
            onClick={() => navigate("/forgot")}
            className="text-md text-indigo-600 cursor-pointer hover:underline hover:text-indigo-700 transition pb-2"
          >
            Forgot Password?
          </span>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? <ClipLoader size={28} color="#fff" /> : "Sign In"}
          </button>

          {/* Google Auth */}
          <button className="w-full mt-3 flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition"
          onClick={googleSignIn}>
            <FaGoogle className="text-red-500" />
            Sign in with Google
          </button>

          {/* Signup Link */}
          <p className="text-sm text-gray-600 text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right Side – Image */}
        <div className="hidden md:block">
          <img
            src={EdugrowLogo}
            alt="Sign In"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;

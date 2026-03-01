import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaGoogle,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import EdugrowLogo from "../assets/edugrowlogo.png";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleSignup = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, { name, email, password, role }, { withCredentials: true })
            dispatch(setUserData(result.data));
            setLoading(false)
            navigate("/")
            toast.success("Signup Successfully")
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );

        } finally {
            setLoading(false);
        }

    }
    const googleSignUp = async ()=>{
        try{
           const response = await signInWithPopup(auth , provider)
           let user =response.user;
           let name = user.displayName;
           let email = user.email;
           
           const result = await axios.post(`${serverUrl}/api/auth/google-auth` , {name , email , role}  , 
            {withCredentials:true})
           dispatch(setUserData(result.data));
            setLoading(false)
            navigate("/")
            toast.success("Signup Successfully") 
        }catch(error){
           console.log(error);
           toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-t from-black to-purple-900 p-4">
            <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white/20 backdrop-blur-md text-black px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>
      
            <div className="w-full max-w-5xl bg-gray-100 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

                {/* Left Side – Form */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">
                        Create Account
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Join as a Student or Educator
                    </p>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-600">Name</label>
                        <div className="flex items-center border rounded-lg px-3 mt-1">
                            <FaUser className="text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="w-full px-3 py-2 outline-none"
                            />
                        </div>
                    </div>

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

                    {/* Role */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-600">Role</label>

                        <div className="flex gap-4 mt-2">
                            {/* Student */}
                            <label
                                className={`flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer transition
        ${role === "student"
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                        : "border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                <FaUserGraduate
                                    className={role === "student" ? "text-indigo-600" : "text-gray-400"}
                                />
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={role === "student"}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="hidden"
                                />
                                Student
                            </label>

                            {/* Educator */}
                            <label
                                className={`flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer transition
        ${role === "educator"
                                        ? "border-green-600 bg-green-50 text-green-700"
                                        : "border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                <FaChalkboardTeacher
                                    className={role === "educator" ? "text-green-600" : "text-gray-400"}
                                />
                                <input
                                    type="radio"
                                    name="role"
                                    value="educator"
                                    checked={role === "educator"}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="hidden"
                                />
                                Educator
                            </label>
                        </div>
                    </div>


                    {/* Sign Up Button */}
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        disabled={loading} onClick={handleSignup}>
                        {loading ? <ClipLoader size={30} /> : "Sign Up"}
                    </button>

                    {/* Google Auth */}
                    <button className="w-full mt-3 flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition"
                    onClick={googleSignUp}>
                        <FaGoogle className="text-red-500" />
                        Sign up with Google
                    </button>

                    {/* Sign In Link */}
                    <p className="text-sm text-gray-600 text-center mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Right Side – Image */}
                <div className="hidden md:flex">
                    <img
                        src={EdugrowLogo}
                        alt="logo"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

export default SignUp;

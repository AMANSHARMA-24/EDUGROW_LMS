import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function ForgotPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const navigate = useNavigate();
  // STEP 1: SEND OTP
  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${serverUrl}/api/auth/send-otp`, { email });
      if (res.data.success) {
        setStep(2);
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp });
      if (res.data.success) {
        setStep(3);
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: RESET PASSWORD
  const resetPassword = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${serverUrl}/api/auth/reset-password`, {
        email,
        newpassword:password,
      });
      if (res.data.success) {
        alert("Password reset successful 🎉");
      } else {
        setError("Password reset failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-black to-purple-900">
      
      
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-black px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">EduGrow 🌱</h1>
          <p className="text-sm text-slate-500">Learn. Grow. Reset.</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Enter Email</h2>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPage;




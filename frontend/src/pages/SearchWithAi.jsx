import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SearchWithAi() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition;
  if (!SpeechRecognition) {
    toast.error("Speech recognition not supported in this browser");
  } else {
    recognition = new SpeechRecognition();
  }

  // Handle microphone click
  const handleMic = () => {
    if (!recognition) return;
    setListening(true);

    recognition.start();

    recognition.onresult = async (e) => {
      let transcript = e.results[0][0].transcript.trim();
      transcript = transcript.replace(/[.!?]$/, "");
      setQuery(transcript);
      setCourses([]);
      await handleSearch(transcript);
    };

    recognition.onend = () => setListening(false);

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      setListening(false);
    };
  };

  // Handle search query
  const handleSearch = async (transcript) => {
    const q = transcript || query;
    if (!q) return;

    setLoading(true);
    setCourses([]);
    setError("");

    try {
      const { data } = await axios.get(`${serverUrl}/api/search/search-ai?q=${q}`);
      if (data && data.length > 0) {
        setCourses(data);
      } else {
        setError("No Courses Found!");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("No Courses Found!");
    } finally {
      setLoading(false);
    }
  };

  // Speech synthesis for feedback
  useEffect(() => {
    window.speechSynthesis.cancel();
    if (courses.length > 0) {
      const utterance = new SpeechSynthesisUtterance("These are the courses I found");
      utterance.rate = 1.8;
      utterance.pitch = 2;
      window.speechSynthesis.speak(utterance);
    } else if (query.length > 0 && !loading && error) {
      const utterance = new SpeechSynthesisUtterance("No courses found");
      utterance.rate = 1.8;
      utterance.pitch = 2;
      window.speechSynthesis.speak(utterance);
    }
  }, [courses, error, query, loading]);

  return (
    <div className="min-h-screen bg-linear-to-l from-black to-purple-900 text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-black px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>

      {/* White Container for Heading + Search */}
      <div className="bg-gray-200 text-black rounded-xl p-8 max-w-3xl mx-auto shadow-lg mb-10 mt-10">
        <h2 className="text-4xl font-bold mb-6 text-center">
          Search with <span className="text-purple-700">AI</span>
        </h2>

        {/* Input field stays on top */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for courses..."
          className="w-full p-3 rounded-full outline-none bg-black text-white placeholder-gray-500 mb-4"
        />

        {/* Buttons container: stacked on mobile, inline on larger screens */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            className="px-6 py-3 rounded-full bg-purple-700 text-white hover:bg-purple-600 transition w-full sm:w-auto"
          >
            <FaSearch className="inline mr-2" /> Search
          </button>

          {/* Microphone Button */}
          <button
            onClick={handleMic}
            className={`px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition w-full sm:w-auto ${listening ? "animate-pulse scale-105 text-purple-400 ring-4 ring-purple-400 ring-opacity-50" : ""
              }`}
          >
            <FaMicrophone className="inline mr-2" /> Speak
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-purple-200 mb-4 animate-pulse">Loading...</p>}
      {error && <p className="text-center text-gray-300 text-2xl pt-12 mb-4">{error}</p>}

      {/* Courses Grid */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white text-black p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
              onClick={() => navigate(`/view-course/${course._id}`)}
            >
              <h3 className="text-2xl font-bold">{course.title}</h3>
              {course.subtitle && <p className="text-gray-600">{course.subtitle}</p>}
              <p className="text-sm text-gray-500 mt-1">
                Category: {course.category} | Level: {course.level} | Price: ₹{course.price || 0}
              </p>
              {course.creator?.name && (
                <p className="text-sm text-gray-500 mt-1">Creator: {course.creator.name}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <p className="text-center text-purple-200 mt-6">No courses to display. Try searching above.</p>
      )}
    </div>
  );
}

export default SearchWithAi; 
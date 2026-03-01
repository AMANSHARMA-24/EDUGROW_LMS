import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

function Card({ thumbnail, title, category, price, courseId }) {
  const navigate = useNavigate();
  const [rating, setrating] = useState(0);
  const [reviews, setreviews] = useState([]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/review/get-reviews/${courseId}`, { withCredentials: true });
        setreviews(res.data.reviews);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, [courseId]);

  useEffect(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce((acc, rev) => acc + rev.rating, 0);
      setrating(total / reviews.length); 
    } else {
      setrating(0);
    }
  }, [reviews]); 


  return (
    <div className="flex flex-col h-full " onClick={() => { navigate(`/view-course/${courseId}`) }}>
      {/* Image */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-40 object-cover rounded-t-2xl"
      />

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1  bg-gray-200 rounded-b-3xl">
        <p className="text-sm text-gray-500">{category}</p>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 capitalize">{title}</h2>
        <p className="text-indigo-600 font-bold text-lg">{price}</p>

        {/* Stars */}
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map(star => (
            <FaStar
              key={star}
              className={`cursor-pointer ${star <= (rating) ? "text-yellow-400" : "text-gray-300"}`}
              size={24}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Card;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlayCircle, FaLock, FaStar } from "react-icons/fa";
import Card from "../components/Card";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { setCoursesData } from "../redux/courseSlice";

function ViewCourse() {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);
    const { userData } = useSelector((state) => state.user);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [creator, setCreator] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);

    // ================= FIND SELECTED COURSE =================
    useEffect(() => {
        if (courseData?.length) {
            const found = courseData.find((course) => course._id === courseId);
            setSelectedCourse(found);
        }
    }, [courseData, courseId]);

    // ================= FETCH CREATOR =================
    useEffect(() => {
        const fetchCreator = async () => {
            try {
                if (!selectedCourse?.creator) return;

                const result = await axios.get(
                    `${serverUrl}/api/course/getcreator/${selectedCourse.creator}`,
                    { withCredentials: true }
                );
                setCreator(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchCreator();
    }, [selectedCourse]);

    // ================= FETCH REVIEWS =================
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/review/get-reviews/${courseId}`, { withCredentials: true });
                setReviews(res.data.reviews);
            } catch (error) {
                console.log(error);
            }
        };
        fetchReviews();
    }, [courseId]);

    if (!selectedCourse) return <p className="p-6">Loading...</p>;

    // ================= CONDITIONS =================
    const isEnrolled = userData?.enrollCources?.includes(courseId);
    const isFreeCourse = selectedCourse?.price === 0 || selectedCourse?.price == null;

    // ================= ENROLL FUNCTION =================
    const handleEnroll = async (userId, courseId) => {
        try {
            if (isFreeCourse) {
                const res = await axios.post(
                    `${serverUrl}/api/order/free-enroll`,
                    { userId, courseId },
                    { withCredentials: true }
                );
                toast.success(res.data.message);
                window.location.reload();
                return;
            }

            const orderData = await axios.post(
                `${serverUrl}/api/order/razorpay-order`,
                { userId, courseId },
                { withCredentials: true }
            );

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.data.amount,
                currency: "INR",
                name: "EDUGROW",
                description: "Course Enrollment Payment",
                order_id: orderData.data.id,
                handler: async function (response) {
                    try {
                        const verifyPayment = await axios.post(
                            `${serverUrl}/api/order/verifypayment`,
                            { ...response, courseId, userId },
                            { withCredentials: true }
                        );

                        toast.success(verifyPayment.data.message);
                        window.location.reload();

                    } catch (error) {
                        toast.error(error.response?.data?.message);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            toast.error("Something went wrong while enrolling");
        }
    };

    // ================= CREATOR OTHER COURSES =================
    const creatorCourses = courseData?.filter(
        (course) => course.creator === selectedCourse.creator && course._id !== selectedCourse._id
    );

    // ================= SUBMIT REVIEW =================
    const handleSubmitReview = async () => {
        if (!rating || !comment.trim()) {
            toast.error("Please provide rating and comment");
            return;
        }

        try {
            const res = await axios.post(
                `${serverUrl}/api/review/create-review`,
                { rating, comment, courseId },
                { withCredentials: true }
            );

            toast.success(res.data.message);
            setReviews(prev => [res.data.review, ...prev]);
            setRating(0);
            setComment("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting review");
        }
    };

    const handleDeleteByAdmin = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(
                `${serverUrl}/api/admin/remove-course/${courseId}`,
                { withCredentials: true }
            );

            toast.success(res.data.message);

            // 🔥 Redux update
            const updatedCourses = courseData.filter(
                (course) => course._id !== courseId
            );

            dispatch(setCoursesData(updatedCourses));

            navigate(-1);

        } catch (error) {
            
            toast.error(
                error.response?.data?.message || "Delete failed"
            );
        }
    };
    

    return (
        <div className="min-h-screen bg-linear-to-l from-black to-purple-900 p-6">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-3 left-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400"
            >
                ← Back
            </button>

            {/* ================= TOP SECTION ================= */}
            <div className="max-w-6xl mx-auto bg-gray-100 rounded-2xl shadow p-6 mt-5 flex flex-col md:flex-row gap-8">

                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-bold">{selectedCourse.title}</h1>
                    <p className="text-gray-600">{selectedCourse?.subtitle}</p>
                    <p className="text-gray-600">{selectedCourse?.description}</p>
                    
                    <div className="text-2xl font-semibold text-purple-700">₹ {selectedCourse.price || 0}</div>
                    <div className="flex-1 ">
                        <p className="text-gray-800">{creator?.name}</p>
                    <p className="text-gray-800">{creator?.email}</p>
                    </div>
                    {isEnrolled ? (
                        <button
                            className="bg-green-700 text-white p-2 rounded-lg mt-5 hover:bg-green-800"
                            onClick={() => navigate(`/viewlectures/${courseId}`)}
                        >
                            Watch Now
                        </button>
                    ) : (
                        <button
                            className="bg-gray-700 text-white p-2 rounded-lg mt-5"
                            onClick={() => handleEnroll(userData._id, courseId)}
                        >
                            Enroll Now
                        </button>
                    )}

                    { (userData?.role === "admin") && <button
                        className="bg-red-500 text-white p-2 ml-4 rounded-lg mt-5 hover:bg-red-600"
                        onClick={() => handleDeleteByAdmin(courseId)}
                    >
                        Delete
                    </button>
                    }
                </div>

                <div className="w-full md:w-96">
                    <img
                        src={selectedCourse.thumbnail}
                        alt="course thumbnail"
                        className="rounded-xl shadow w-full object-cover"
                    />
                </div>
            </div>

            {/* ================= COURSE CONTENT ================= */}
            <div className="max-w-6xl mx-auto mt-8 bg-gray-100 rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {selectedCourse.lectures?.map((lecture, index) => (
                        <div key={lecture._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-3">
                                {lecture.isPreviewFree ? (
                                    <FaPlayCircle className="text-green-600" />
                                ) : (
                                    <FaLock className="text-gray-500" />
                                )}
                                <span>Lecture {index + 1}: {lecture.lectureTitle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= REVIEW / COMMENT SECTION ================= */}
            <div className="max-w-6xl mx-auto mt-8 bg-gray-100 rounded-2xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>

                {/*  Rating Input + Comment */}
                {isEnrolled && (
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <FaStar
                                    key={star}
                                    className={`cursor-pointer ${star <= (rating) ? "text-yellow-400" : "text-gray-300"}`}
                                    onClick={() => setRating(star)}
                                    size={24}
                                />
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full p-2 border rounded mb-2"
                        />

                        <button
                            onClick={handleSubmitReview}
                            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                        >
                            Submit Review
                        </button>
                    </div>
                )}

                {/* Existing Reviews */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p>No reviews yet</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev._id} className="p-4 bg-gray-50 rounded shadow">
                                <div className="flex items-center mb-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <FaStar key={star} className={star <= rev.rating ? "text-yellow-400" : "text-gray-300"} />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">{rev.user.name}</span>
                                </div>
                                <p className="mb-3 text-sm text-gray-500">{rev.user.email}</p>
                                <p>{rev.comment}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(rev.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ================= CREATOR + OTHER COURSES ================= */}
            {creatorCourses?.length > 0 && (
                <div className="max-w-6xl mx-auto mt-10 bg-gray-100 rounded-2xl shadow p-6">

                    {/* CREATOR INFO */}
                    {creator && (
                        <div className="flex items-center gap-6 mb-8 border-b pb-6">
                            <img
                                src={creator.photoUrl}
                                alt="creator"
                                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                            />

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    More Courses By {creator.name}
                                </h2>

                                <p className="text-gray-600 text-sm mt-1">
                                    {creator.description || "Instructor"}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">{creator.email}</p>
                            </div>
                        </div>
                    )}

                    {/* OTHER COURSES GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {creatorCourses.map(course => (
                            <Card
                                key={course._id}
                                thumbnail={course.thumbnail}
                                title={course.title}
                                category={course.category}
                                price={`₹ ${course.price || 0}`}
                                courseId={course._id}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewCourse;
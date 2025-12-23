import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { addToCart } from "../redux/slices/cartSlice";
import { Star, Clock, Users, BookOpen, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import RatingModal from "../components/core/Course/RatingModal";
import { createRating } from "../services/operations/ratingAPI";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);
  
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        console.log("Course Details Result:", result);
        console.log("Rating and Reviews:", result?.data?.ratingAndReviews);
        setCourseData(result?.data);
      } catch (error) {
        console.log("Could not fetch course details");
      }
      setLoading(false);
    };
    getCourseDetails();
  }, [courseId]);

  const calculateAverageRating = () => {
    if (!courseData?.ratingAndReviews || courseData.ratingAndReviews.length === 0) {
      return { avgRating: 0, totalReviews: 0 };
    }
    const totalReviews = courseData.ratingAndReviews.length;
    const avgRating = courseData.ratingAndReviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews;
    return { avgRating: avgRating.toFixed(1), totalReviews };
  };

  const handleRatingSubmit = async () => {
    setShowRatingModal(false);
    // Refresh course details
    const result = await fetchCourseDetails(courseId);
    setCourseData(result?.data);
  };

  // Check if user already reviewed this course
  const getUserExistingReview = () => {
    if (!user || !courseData?.ratingAndReviews) return null;
    return courseData.ratingAndReviews.find(
      (review) => review.user?._id === user._id || review.user === user._id
    );
  };

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please login to add courses to cart");
      navigate("/login");
      return;
    }

    if (user?.accountType === "Instructor") {
      toast.error("Instructors cannot purchase courses");
      return;
    }

    // Check if already enrolled
    if (courseData?.studentsEnrolled?.includes(user?._id)) {
      toast.error("You are already enrolled in this course");
      navigate("/dashboard/enrolled-courses");
      return;
    }

    // Check if already in cart
    const isInCart = cart.some((item) => item._id === courseData._id);
    if (isInCart) {
      toast.error("Course already in cart");
      navigate("/dashboard/cart");
      return;
    }

    dispatch(addToCart(courseData));
  };

  const handleBuyNow = () => {
    if (!token) {
      toast.error("Please login to purchase courses");
      navigate("/login");
      return;
    }

    if (user?.accountType === "Instructor") {
      toast.error("Instructors cannot purchase courses");
      return;
    }

    // Check if already enrolled
    if (courseData?.studentsEnrolled?.includes(user?._id)) {
      toast.error("You are already enrolled in this course");
      navigate("/dashboard/enrolled-courses");
      return;
    }

    // Add to cart and go to checkout
    const isInCart = cart.some((item) => item._id === courseData._id);
    if (!isInCart) {
      dispatch(addToCart(courseData));
    }
    navigate("/dashboard/cart");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark-700 text-xl">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-dark-100 border-b border-dark-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-dark-900">
                {courseData.courseName}
              </h1>
              <p className="text-dark-700">{courseData.courseDescription}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-primary-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{calculateAverageRating().avgRating || "New"}</span>
                </div>
                <div className="flex items-center gap-2 text-dark-700">
                  <Users className="w-5 h-5" />
                  <span>{courseData.studentsEnrolled?.length || 0} Students</span>
                </div>
                <div className="flex items-center gap-2 text-dark-700">
                  <MessageSquare className="w-5 h-5" />
                  <span>{calculateAverageRating().totalReviews} Reviews</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={courseData.instructor?.image}
                  alt={courseData.instructor?.firstName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm text-dark-600">Created by</p>
                  <p className="font-semibold text-dark-900">
                    {courseData.instructor?.firstName} {courseData.instructor?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                {token && user?.accountType === "Student" && 
                  courseData?.studentsEnrolled?.includes(user?._id) ? (
                  <button
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                    className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-semibold"
                  >
                    Go to Course
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className="px-8 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold"
                    >
                      Buy Now - ₹{courseData.price}
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="px-8 py-3 bg-dark-200 text-dark-900 rounded-md hover:bg-dark-300 transition font-semibold"
                    >
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="lg:order-last">
              <img
                src={courseData.thumbnail}
                alt={courseData.courseName}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                What you'll learn
              </h2>
              <p className="text-dark-700">{courseData.whatYouWillLearn}</p>
            </div>

            {/* Course Content */}
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                Course Content
              </h2>
              <div className="space-y-2">
                {courseData.courseContent?.map((section, index) => (
                  <div
                    key={index}
                    className="bg-dark-100 border border-dark-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-dark-900">
                      {section.sectionName}
                    </h3>
                    <p className="text-sm text-dark-600 mt-1">
                      {section.subSection?.length || 0} lectures
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {courseData.instructions && (
              <div>
                <h2 className="text-2xl font-bold text-dark-900 mb-4">
                  Requirements
                </h2>
                <ul className="list-disc list-inside space-y-2 text-dark-700">
                  {courseData.instructions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-dark-900">
                  Student Reviews ({calculateAverageRating().totalReviews})
                </h2>
                {token && user?.accountType === "Student" && 
                  courseData?.studentsEnrolled?.includes(user?._id) && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-medium"
                  >
                    {getUserExistingReview() ? "Edit Your Review" : "Write a Review"}
                  </button>
                )}
              </div>

              {courseData?.ratingAndReviews && courseData.ratingAndReviews.length > 0 ? (
                <div className="space-y-4">
                  {courseData.ratingAndReviews.slice(0, 5).map((review, index) => (
                    <div key={index} className="bg-dark-100 border border-dark-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={review.user?.image || "https://via.placeholder.com/40"}
                          alt={review.user?.firstName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-dark-900">
                              {review.user?.firstName} {review.user?.lastName}
                            </p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-primary-500 fill-current"
                                      : "text-dark-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-dark-700 text-sm">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-dark-100 rounded-lg">
                  <p className="text-dark-600">No reviews yet. Be the first to review this course!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 sticky top-4 space-y-4">
              <h3 className="font-bold text-xl text-dark-900">
                This course includes:
              </h3>
              <div className="space-y-3 text-dark-700">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-500" />
                  <span>Access on mobile and desktop</span>
                </div>
              </div>
              {token && user?.accountType === "Student" && 
                courseData?.studentsEnrolled?.includes(user?._id) ? (
                <button
                  onClick={() => navigate("/dashboard/enrolled-courses")}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-semibold"
                >
                  Go to Course
                </button>
              ) : (
                <button
                  onClick={handleBuyNow}
                  className="w-full px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          courseId={courseId}
          onClose={() => setShowRatingModal(false)}
          onRatingSubmit={handleRatingSubmit}
          existingReview={getUserExistingReview()}
        />
      )}
    </div>
  );
};

export default CourseDetails;

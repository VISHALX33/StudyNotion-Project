import { useState, useEffect } from "react";
import { getAllReviews } from "../services/operations/ratingAPI";
import { Star } from "lucide-react";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const result = await getAllReviews();
        setReviews(result || []);
      } catch (error) {
        console.log("Could not fetch reviews");
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 pt-24 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-dark-900 mb-4">
            Student Reviews
          </h1>
          <p className="text-dark-700 max-w-2xl mx-auto">
            See what our students have to say about their learning experience
          </p>
        </div>

        {/* No Reviews */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-500 text-xl font-medium">No reviews yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.user?.image || "https://via.placeholder.com/40"}
                    alt={review.user?.firstName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-dark-900">
                      {review.user?.firstName} {review.user?.lastName}
                    </p>
                    <p className="text-sm text-dark-500">{review.user?.email}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-dark-900 font-semibold">
                    {review.rating}/5
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-dark-700 mb-4">{review.review}</p>

                {/* Course Info */}
                {review.course && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-dark-500">Course:</p>
                    <p className="font-medium text-primary-500">
                      {review.course.courseName}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;

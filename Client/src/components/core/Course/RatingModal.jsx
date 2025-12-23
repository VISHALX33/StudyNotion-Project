import { useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../../../services/apiconnector";
import { courseEndpoints } from "../../../services/apis";
import { toast } from "react-hot-toast";
import { FiX, FiStar } from "react-icons/fi";

const RatingModal = ({ courseId, onClose, onRatingSubmit, existingReview }) => {
  const { token } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [review, setReview] = useState(existingReview?.review || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    setLoading(true);
    try {
      const response = await apiConnector(
        "POST",
        courseEndpoints.CREATE_RATING_API,
        { courseId, rating, review },
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        toast.success(existingReview 
          ? "Rating and review updated successfully" 
          : "Rating and review submitted successfully");
        onRatingSubmit();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-dark-900">
            {existingReview ? "Edit Your Review" : "Rate this Course"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-100 rounded-full transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3">
              Your Rating
            </label>
            <div className="flex gap-2 justify-center ">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transform hover:scale-110 transition"
                >
                  <FiStar
                    className={`w-10 h-10 ${
                      star <= rating
                        ? "fill-primary-500 text-primary-500"
                        : "text-dark-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-dark-600 mt-2">
                You rated {rating} out of 5 stars
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Share your thoughts about this course..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-dark-300 text-black  rounded-md  transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : existingReview ? "Update Rating" : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;

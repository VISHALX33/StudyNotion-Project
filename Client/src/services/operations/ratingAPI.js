import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { courseEndpoints, ratingsEndpoints } from "../apis";

const { CREATE_RATING_API } = courseEndpoints;
const { REVIEWS_DETAILS_API } = ratingsEndpoints;

// Create rating and review
export const createRating = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Submitting your review...");
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE RATING API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    toast.success("Rating and review submitted successfully!");
    result = response.data;
  } catch (error) {
    console.log("CREATE RATING API ERROR:", error);
    toast.error(error.response?.data?.message || "Could not submit rating");
  }
  toast.dismiss(toastId);
  return result;
};

// Get all reviews
export const getAllReviews = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", REVIEWS_DETAILS_API);
    console.log("GET ALL REVIEWS API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Reviews");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET ALL REVIEWS API ERROR:", error);
  }
  return result;
};

// Get course rating (from course details)
export const getCourseRating = (course) => {
  if (!course?.ratingAndReviews || course.ratingAndReviews.length === 0) {
    return { avgRating: 0, totalReviews: 0 };
  }
  
  const totalReviews = course.ratingAndReviews.length;
  const avgRating = course.ratingAndReviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews;
  
  return {
    avgRating: avgRating.toFixed(1),
    totalReviews,
  };
};

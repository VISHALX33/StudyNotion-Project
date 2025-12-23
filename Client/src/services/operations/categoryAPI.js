import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { courseEndpoints, categoryEndpoints } from "../apis";

const { COURSE_CATEGORIES_API } = courseEndpoints;
const { CREATE_CATEGORY_API, DELETE_CATEGORY_API } = categoryEndpoints;

// Get all categories
export const getAllCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    console.log("GET_ALL_CATEGORIES_API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Categories");
    }
    result = response?.data?.allCategory;
  } catch (error) {
    console.log("GET_ALL_CATEGORIES_API ERROR:", error);
    toast.error(error.message || "Could Not Fetch Categories");
  }
  return result;
};

// Create category (Admin only)
export const createCategory = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Creating Category...");
  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE_CATEGORY_API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    console.log("CREATE_CATEGORY_API ERROR:", error);
    toast.error(error.response?.data?.message || "Could Not Create Category");
  }
  toast.dismiss(toastId);
  return result;
};

// Delete category (Admin only)
export const deleteCategory = async (categoryId, token) => {
  let result = null;
  const toastId = toast.loading("Deleting Category...");
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_CATEGORY_API}/${categoryId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("DELETE_CATEGORY_API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    console.log("DELETE_CATEGORY_API ERROR:", error);
    toast.error(error.response?.data?.message || "Could Not Delete Category");
  }
  toast.dismiss(toastId);
  return result;
};

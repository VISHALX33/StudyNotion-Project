import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndpoints, settingsEndpoints } from "../apis";
import { logout } from "./authAPI";
import { setUser } from "../../redux/slices/profileSlice";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints;

const {
  UPDATE_PROFILE_API,
  UPDATE_DISPLAY_PICTURE_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET_USER_DETAILS_API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setUser(response.data.data));
      toast.success("User Details Fetched Successfully");
    } catch (error) {
      console.log("GET_USER_DETAILS_API ERROR:", error);
      toast.error("Could Not Get User Details");
      dispatch(logout(navigate));
    }
    toast.dismiss(toastId);
  };
}

export async function updateProfile(token, formData) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE_PROFILE_API RESPONSE:", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Profile Updated Successfully");
    return response.data.profileDetails;
  } catch (error) {
    console.log("UPDATE_PROFILE_API ERROR:", error);
    toast.error("Could Not Update Profile");
  }
  toast.dismiss(toastId);
}

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );
      console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Display Picture Updated Successfully");
      dispatch(setUser(response.data.data));
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API ERROR:", error);
      toast.error("Could Not Update Display Picture");
    }
    toast.dismiss(toastId);
  };
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("DELETE_PROFILE_API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Account Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.log("DELETE_PROFILE_API ERROR:", error);
      toast.error("Could Not Delete Account");
    }
    toast.dismiss(toastId);
  };
}

export async function getEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET_ENROLLED_COURSES_API RESPONSE:", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    console.log("GET_ENROLLED_COURSES_API ERROR:", error);
    toast.error("Could Not Get Enrolled Courses");
  }
  toast.dismiss(toastId);
  return result;
}

export async function getInstructorDashboardData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET_INSTRUCTOR_DASHBOARD_API RESPONSE:", response);

    if (!response?.data?.courses) {
      throw new Error("Could Not Fetch Instructor Dashboard Data");
    }
    result = response.data.courses;
  } catch (error) {
    console.log("GET_INSTRUCTOR_DASHBOARD_API ERROR:", error);
    toast.error("Could Not Get Instructor Dashboard Data");
  }
  toast.dismiss(toastId);
  return result;
}

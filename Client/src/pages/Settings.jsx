import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  updateProfile,
  updateDisplayPicture,
  deleteProfile,
} from "../services/operations/profileAPI";
import { setUser } from "../redux/slices/profileSlice";
import Button from "../components/common/Button";

const Settings = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateofbirth: user?.additionalDetails?.dateofbirth || "",
      gender: user?.additionalDetails?.gender || "",
      contactNumber: user?.additionalDetails?.contactNumber || "",
      about: user?.additionalDetails?.about || "",
    },
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  // Upload display picture
  const handleFileUpload = () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }
    const formData = new FormData();
    formData.append("displayPicture", imageFile);
    dispatch(updateDisplayPicture(token, formData));
    setImageFile(null);
    setPreviewSource(null);
  };

  // Update profile information
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const profileData = await updateProfile(token, data);
      if (profileData) {
        // Update user in redux store
        const updatedUser = {
          ...user,
          additionalDetails: profileData,
        };
        dispatch(setUser(updatedUser));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  // Delete account
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      dispatch(deleteProfile(token, navigate));
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900">Settings</h1>
          <p className="text-dark-700 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Change Profile Picture */}
        <div className="bg-white rounded-lg border border-dark-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4">Change Profile Picture</h2>
          <div className="flex items-center gap-6">
            <img
              src={previewSource || user?.image}
              alt={`${user?.firstName}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary-500"
            />
            <div className="flex flex-col gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 border border-dark-300 text-black rounded-md hover:bg-dark-100 transition"
              >
                <FiUpload />
                Select Image
              </button>
              {imageFile && (
                <button
                  onClick={handleFileUpload}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-dark-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-6">Profile Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName", { required: "First name is required" })}
                className="w-full px-4 py-2 border border-dark-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName", { required: "Last name is required" })}
                className="w-full px-4 py-2 border border-dark-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dateofbirth")}
                className="w-full px-4 py-2 border border-dark-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Gender
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full px-4 py-2 border border-dark-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit number",
                  },
                })}
                className="w-full px-4 py-2 border border-dark-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter contact number"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-black mb-2">
              About
            </label>
            <textarea
              {...register("about")}
              rows="4"
              className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Write something about yourself"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
  type="button"
  onClick={() => navigate("/dashboard/my-profile")}
  className="px-6 py-2 border border-dark-300 text-black rounded-md 
             hover:bg-dark-100 hover:text-white transition"
>
  Cancel
</button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Delete Account */}
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <FiTrash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 mb-2">Delete Account</h2>
              <p className="text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../../../services/operations/courseAPI";
import { useSelector } from "react-redux";

const SubSectionModal = ({ sectionId, course, setCourse, onClose, subsection = null }) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: subsection || {},
  });

  const isEditing = !!subsection;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const onSubmit = async (data) => {
    if (!isEditing && !videoFile) {
      toast.error("Please select a video file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("sectionId", sectionId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("timeDuration", data.timeDuration);

    if (videoFile) {
      formData.append("videoFile", videoFile);
    }

    try {
      let result;
      if (isEditing) {
        formData.append("subsectionId", subsection._id);
        result = await updateSubSection(formData, token);
      } else {
        result = await createSubSection(formData, token);
      }

      if (result) {
        setCourse(result);
        toast.success(
          isEditing ? "Lecture updated successfully" : "Lecture created successfully"
        );
        onClose();
      }
    } catch (error) {
      console.error("Error saving subsection:", error);
      toast.error("Failed to save lecture");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-900">
            {isEditing ? "Edit Lecture" : "Add Lecture"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-100 rounded-full transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Lecture Title *
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter lecture title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Lecture Description *
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              rows="4"
              className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter lecture description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Duration (e.g., 10:30) *
            </label>
            <input
              type="text"
              {...register("timeDuration", { required: "Duration is required" })}
              className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="MM:SS"
            />
            {errors.timeDuration && (
              <p className="text-red-500 text-sm mt-1">{errors.timeDuration.message}</p>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Video File {!isEditing && "*"}
            </label>
            <div className="border-2 border-dashed border-dark-300 rounded-lg p-6 text-center">
              <FiUpload className="w-8 h-8 text-dark-400 mx-auto mb-2" />
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer text-primary-500 hover:text-primary-600"
              >
                {videoFile
                  ? videoFile.name
                  : isEditing
                  ? "Upload new video (optional)"
                  : "Click to upload video"}
              </label>
              <p className="text-xs text-dark-600 mt-2">MP4, AVI, MOV (Max 100MB)</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-dark-300 text-black  rounded-md hover:bg-dark-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update Lecture" : "Add Lecture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubSectionModal;

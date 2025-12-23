import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { fetchCourseCategories, getFullDetailsOfCourse, editCourseDetails } from "../services/operations/courseAPI";
import { FiUpload, FiArrowRight, FiCheck } from "react-icons/fi";
import Spinner from "../components/common/Spinner";
import CourseBuilder from "../components/core/Dashboard/CourseBuilder";

const EditCourse = () => {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [course, setCourse] = useState(null);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch categories
      const categoriesResult = await fetchCourseCategories();
      if (categoriesResult) {
        setCategories(categoriesResult);
      }

      // Fetch course details
      const courseDetails = await getFullDetailsOfCourse(courseId, token);
      if (courseDetails) {
        const courseData = courseDetails.courseDetails;
        setCourse(courseData);
        setThumbnailPreview(courseData.thumbnail);

        // Set form values
        reset({
          courseName: courseData.courseName,
          courseDescription: courseData.courseDescription,
          whatYouWillLearn: courseData.whatYouWillLearn,
          price: courseData.price,
          category: courseData.category._id,
          tag: courseData.tag?.join(", ") || "",
          instructions: courseData.instructions?.join(", ") || "",
        });
      }

      setLoading(false);
    };
    fetchData();
  }, [courseId, token, reset]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("thumbnailImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("courseName", data.courseName);
    formData.append("courseDescription", data.courseDescription);
    formData.append("whatYouWillLearn", data.whatYouWillLearn);
    formData.append("price", data.price);
    formData.append("category", data.category);
    
    if (data.thumbnailImage) {
      formData.append("thumbnailImage", data.thumbnailImage);
    }
    
    formData.append("tag", JSON.stringify(data.tag.split(",").map((tag) => tag.trim())));
    formData.append("instructions", JSON.stringify(data.instructions.split(",").map((i) => i.trim())));

    const result = await editCourseDetails(formData, token);
    if (result) {
      setCourse(result);
      setStep(2);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const handleFinish = () => {
    navigate("/dashboard/my-courses");
  };

  return (
    <div className="min-h-screen bg-dark-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-primary-500 text-white" : "bg-dark-200 text-dark-600"
              }`}>
                {step > 1 ? <FiCheck /> : "1"}
              </div>
              <span className={step >= 1 ? "text-dark-900 font-semibold" : "text-dark-600"}>
                Course Information
              </span>
            </div>
            <div className="w-16 h-1 bg-dark-200">
              <div className={`h-full ${step >= 2 ? "bg-primary-500" : ""} transition-all`} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-primary-500 text-white" : "bg-dark-200 text-dark-600"
              }`}>
                2
              </div>
              <span className={step >= 2 ? "text-dark-900 font-semibold" : "text-dark-600"}>
                Course Builder
              </span>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-3xl font-bold text-dark-900 mb-8">Edit Course</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Course Name */}
          <div className="bg-white rounded-lg border border-dark-200 p-6">
            <label className="block text-sm font-medium text-black mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("courseName", { required: "Course name is required" })}
              className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter course title"
            />
            {errors.courseName && (
              <p className="text-red-500 text-sm mt-1">{errors.courseName.message}</p>
            )}
          </div>

          {/* Course Description */}
          <div className="bg-white rounded-lg border border-dark-200 p-6">
            <label className="block text-sm font-medium text-black mb-2">
              Course Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("courseDescription", {
                required: "Course description is required",
              })}
              rows="5"
              className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter course description"
            />
            {errors.courseDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.courseDescription.message}</p>
            )}
          </div>

          {/* What You Will Learn */}
          <div className="bg-white rounded-lg border border-dark-200 p-6">
            <label className="block text-sm font-medium text-black mb-2">
              What You Will Learn <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("whatYouWillLearn", {
                required: "This field is required",
              })}
              rows="3"
              className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="What students will learn from this course"
            />
            {errors.whatYouWillLearn && (
              <p className="text-red-500 text-sm mt-1">{errors.whatYouWillLearn.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div className="bg-white rounded-lg border border-dark-200 p-6">
              <label className="block text-sm font-medium text-black mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="bg-white rounded-lg border border-dark-200 p-6">
              <label className="block text-sm font-medium text-black mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg border border-dark-200 p-6">
            <label className="block text-sm font-medium text-black mb-2">
              Tags <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("tag", { required: "At least one tag is required" })}
              className="w-full px-4 py-2 border border-dark-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter tags separated by commas (e.g., React, JavaScript)"
            />
            {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag.message}</p>}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg border  border-dark-200 p-6">
            <label className="block text-sm font-medium text-black mb-2">
              Instructions <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("instructions", { required: "Instructions are required" })}
              className="w-full px-4 py-2 border border-dark-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter instructions separated by commas"
            />
            {errors.instructions && (
              <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-lg border text-black border-dark-200 p-6">
            <label className="block text-sm font-medium text-black mb-2">
              Course Thumbnail
            </label>
            <div className="flex items-center gap-4">
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-32 h-20 object-cover rounded"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-dark-300 text-black rounded-md hover:bg-dark-100 transition cursor-pointer">
                <FiUpload />
                Change Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-courses")}
              className="px-6 py-3 border border-dark-300 text-dark-900 rounded-md hover:bg-dark-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold"
            >
              Next: Edit Sections
              <FiArrowRight />
            </button>
          </div>
        </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-dark-900 mb-8">
              Edit Course Content: {course?.courseName}
            </h1>
            
            <CourseBuilder course={course} setCourse={setCourse} />
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-dark-300 text-dark-900 rounded-md hover:bg-dark-100 transition"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-semibold"
              >
                <FiCheck />
                Finish Editing
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditCourse;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses, deleteCourse } from "../services/operations/courseAPI";
import Spinner from "../components/common/Spinner";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const MyCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [token]);

  const handleDeleteCourse = async (courseId) => {
    const confirm = window.confirm("Are you sure you want to delete this course?");
    if (confirm) {
      await deleteCourse({ courseId }, token);
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">My Courses</h1>
            <p className="text-dark-700 mt-2">Manage your courses</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/add-course")}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold"
          >
            <FiPlus />
            Create New Course
          </button>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg border border-dark-200 p-12 text-center">
            <p className="text-dark-700 text-lg mb-4">You haven't created any courses yet</p>
            <button
              onClick={() => navigate("/dashboard/add-course")}
              className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-dark-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-50 border-b border-dark-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-white font-semibold">Course</th>
                    <th className="text-left py-4 px-6 text-white font-semibold">Duration</th>
                    <th className="text-left py-4 px-6 text-white font-semibold">Price</th>
                    <th className="text-center py-4 px-6 text-white font-semibold">Status</th>
                    <th className="text-center py-4 px-6 text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b border-dark-200 ">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={course.thumbnail}
                            alt={course.courseName}
                            className="w-20 h-14 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold text-black">{course.courseName}</p>
                            <p className="text-sm text-black line-clamp-1">
                              {course.courseDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-black">
                        {course.courseContent?.length || 0} Sections
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-black">₹{course.price}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            course.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded transition"
                            title="Edit"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

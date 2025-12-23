import { useState, useEffect } from "react";
import { getAllCourses } from "../services/operations/courseDetailsAPI";
import { Link } from "react-router-dom";
import { Star, Users } from "lucide-react";

const Catalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses();
        setCourses(result);
      } catch (error) {
        console.log("Could not fetch courses");
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const calculateAverageRating = (course) => {
    if (!course?.ratingAndReviews || course.ratingAndReviews.length === 0) {
      return { avgRating: 0, totalReviews: 0 };
    }
    const totalReviews = course.ratingAndReviews.length;
    const avgRating = course.ratingAndReviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews;
    return { avgRating: avgRating.toFixed(1), totalReviews };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 pt-24 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-900 mb-4">
            All Courses
          </h1>
          <p className="text-dark-700">
            Explore our comprehensive collection of courses
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-700 text-xl">No courses available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="bg-dark-100 border border-dark-200 rounded-lg overflow-hidden hover:shadow-lg transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-dark-900 line-clamp-2">
                    {course.courseName}
                  </h3>
                  <p className="text-sm text-dark-600 line-clamp-2">
                    {course.courseDescription}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-primary-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{calculateAverageRating(course).avgRating || "New"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-dark-600">
                      <Users className="w-4 h-4" />
                      <span>{course.studentsEnrolled?.length || 0}</span>
                    </div>
                    <span className="text-dark-500">
                      ({calculateAverageRating(course).totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-dark-200">
                    <span className="text-2xl font-bold text-primary-500">
                      ₹{course.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getFullDetailsOfCourse, updateCourseProgress } from "../services/operations/courseAPI";
import Spinner from "../components/common/Spinner";
import { FiCheck, FiLock, FiPlayCircle } from "react-icons/fi";

const ViewCourse = () => {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [activeSubsection, setActiveSubsection] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      console.log("Fetching course data for courseId:", courseId);
      const result = await getFullDetailsOfCourse(courseId, token);
      console.log("Course data result:", result);
      if (result) {
        setCourseData(result);
        setCompletedLectures(result.completedVideos || []);
        
        // Set first section and subsection as active
        if (result.courseDetails?.courseContent?.length > 0) {
          setActiveSection(result.courseDetails.courseContent[0]);
          if (result.courseDetails.courseContent[0].SubSection?.length > 0) {
            setActiveSubsection(result.courseDetails.courseContent[0].SubSection[0]);
          }
        }
      } else {
        console.log("No course data returned");
      }
      setLoading(false);
    };
    fetchCourseData();
  }, [courseId, token]);

  const handleLectureComplete = async (subsectionId) => {
    if (!completedLectures.includes(subsectionId)) {
      await updateCourseProgress({ courseId, subsectionId }, token);
      setCompletedLectures([...completedLectures, subsectionId]);
    }
  };

  const isLectureCompleted = (subsectionId) => {
    return completedLectures.includes(subsectionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-black">Course not found</p>
      </div>
    );
  }

  const { courseDetails, totalDuration } = courseData;

  return (
    <div className="flex h-screen bg-dark-100">
      {/* Sidebar - Course Content */}
      <div className="w-80 bg-white border-r border-dark-200 overflow-y-auto">
        <div className="p-6 border-b border-dark-200">
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="text-primary-500 hover:text-primary-600 transition text-sm mb-4"
          >
            ← Back to Courses
          </button>
          <h2 className="text-xl font-bold text-black">{courseDetails.courseName}</h2>
          <p className="text-sm text-black mt-2">
            {completedLectures.length} / {courseDetails.courseContent.reduce((acc, section) => acc + (section.SubSection?.length || 0), 0)} Completed
          </p>
        </div>

        <div className="p-4">
          {courseDetails.courseContent.map((section, index) => (
            <div key={section._id} className="mb-4">
              <button
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeSection?._id === section._id
                    ? "bg-primary-50 text-primary-600"
                    : "hover:bg-dark-50 text-black"
                }`}
              >
                <p className="font-semibold">
                  Section {index + 1}: {section.sectionName}
                </p>
                <p className="text-xs text-black mt-1">
                  {section.SubSection?.length || 0} Lectures
                </p>
              </button>

              {activeSection?._id === section._id && (
                <div className="mt-2 ml-4 space-y-1">
                  {section.SubSection?.map((lecture) => (
                    <button
                      key={lecture._id}
                      onClick={() => setActiveSubsection(lecture)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                        activeSubsection?._id === lecture._id
                          ? "bg-primary-500 text-white"
                          : "hover:bg-dark-50 text-black"
                      }`}
                    >
                      {isLectureCompleted(lecture._id) ? (
                        <FiCheck className="w-4 h-4 flex-shrink-0 text-green-500" />
                      ) : (
                        <FiPlayCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="text-sm truncate">{lecture.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Video Player */}
      <div className="flex-1 overflow-y-auto">
        {activeSubsection ? (
          <div className="p-8">
            <div className="max-w-5xl mx-auto">
              {/* Video Player */}
              <div className="bg-black rounded-lg mb-6 overflow-hidden">
                {activeSubsection.videoUrl ? (
                  <video
                    key={activeSubsection._id}
                    controls
                    controlsList="nodownload"
                    className="w-full aspect-video"
                    onEnded={() => handleLectureComplete(activeSubsection._id)}
                  >
                    <source src={activeSubsection.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="aspect-video flex items-center justify-center text-white">
                    <div className="text-center">
                      <FiPlayCircle className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl">No video available</p>
                      <p className="text-sm text-gray-400 mt-2">
                        This lecture doesn't have a video yet
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lecture Info */}
              <div className="bg-white rounded-lg border border-dark-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-black mb-2">
                      {activeSubsection.title}
                    </h1>
                    <p className="text-black">{activeSubsection.description}</p>
                  </div>
                  <button
                    onClick={() => handleLectureComplete(activeSubsection._id)}
                    disabled={isLectureCompleted(activeSubsection._id)}
                    className={`px-4 py-2 rounded-md font-medium transition ${
                      isLectureCompleted(activeSubsection._id)
                        ? "bg-green-500 text-white"
                        : "bg-primary-500 text-white hover:bg-primary-600"
                    }`}
                  >
                    {isLectureCompleted(activeSubsection._id) ? (
                      <span className="flex items-center gap-2">
                        <FiCheck /> Completed
                      </span>
                    ) : (
                      "Mark as Complete"
                    )}
                  </button>
                </div>

                {activeSubsection.timeDuration && (
                  <p className="text-sm text-black">
                    Duration: {activeSubsection.timeDuration}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FiLock className="w-16 h-16 text-black mx-auto mb-4" />
              <p className="text-black text-lg">Select a lecture to start learning</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourse;

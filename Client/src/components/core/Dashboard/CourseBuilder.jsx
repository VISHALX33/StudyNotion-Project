import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { createSection, updateSection, deleteSection } from "../../../services/operations/courseAPI";
import { useSelector } from "react-redux";
import SubSectionModal from "./SubSectionModal";

const CourseBuilder = ({ course, setCourse }) => {
  const { token } = useSelector((state) => state.auth);
  const [editSectionId, setEditSectionId] = useState(null);
  const [addSection, setAddSection] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);
  const [showSubSectionModal, setShowSubSectionModal] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [editingSubSection, setEditingSubSection] = useState(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleAddSection = async (data) => {
    try {
      const result = await createSection(
        { sectionName: data.sectionName, courseId: course._id },
        token
      );
      if (result) {
        setCourse(result);
        setAddSection(false);
        reset();
        toast.success("Section created successfully");
      }
    } catch (error) {
      console.error("Error creating section:", error);
      toast.error("Failed to create section");
    }
  };

  const handleEditSection = async (data) => {
    try {
      const result = await updateSection(
        { sectionName: data.sectionName, sectionId: editSectionId },
        token
      );
      if (result) {
        setCourse(result);
        setEditSectionId(null);
        reset();
        toast.success("Section updated successfully");
      }
    } catch (error) {
      console.error("Error updating section:", error);
      toast.error("Failed to update section");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    try {
      const result = await deleteSection({ sectionId, courseId: course._id }, token);
      if (result) {
        setCourse(result);
        toast.success("Section deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Failed to delete section");
    }
  };

  const startEditSection = (section) => {
    setEditSectionId(section._id);
    setValue("sectionName", section.sectionName);
    setAddSection(false);
  };

  const cancelEdit = () => {
    setEditSectionId(null);
    setAddSection(false);
    reset();
  };

  const handleAddLecture = (sectionId) => {
    setCurrentSectionId(sectionId);
    setEditingSubSection(null);
    setShowSubSectionModal(true);
  };

  const handleEditLecture = (sectionId, subsection) => {
    setCurrentSectionId(sectionId);
    setEditingSubSection(subsection);
    setShowSubSectionModal(true);
  };

  return (
    <div className="bg-white rounded-lg border border-dark-200 p-6">
      <h2 className="text-2xl font-bold text-black mb-6">Course Builder</h2>

      {/* Add/Edit Section Form */}
      {(addSection || editSectionId) && (
        <form
          onSubmit={handleSubmit(editSectionId ? handleEditSection : handleAddSection)}
          className="mb-6 p-4 text-black bg-dark-50 rounded-lg"
        >
          <input
            type="text"
            placeholder="Enter Section Name"
            {...register("sectionName", { required: "Section name is required" })}
            className="w-full px-4 py-2 border text-black border-dark-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
          />
          {errors.sectionName && (
            <p className="text-red-500 text-sm mb-2">{errors.sectionName.message}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
            >
              {editSectionId ? "Update Section" : "Create Section"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border border-dark-300 text-dark-900 rounded-md hover:bg-dark-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Section Button */}
      {!addSection && !editSectionId && (
        <button
          onClick={() => setAddSection(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition mb-6"
        >
          <FiPlus />
          Add Section
        </button>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {course?.courseContent?.length === 0 ? (
          <p className="text-dark-700 text-center py-8">
            No sections yet. Add your first section to get started.
          </p>
        ) : (
          course?.courseContent?.map((section) => (
            <div key={section._id} className="border border-dark-200 rounded-lg">
              <div className="flex items-center justify-between p-4 bg-dark-50">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleSection(section._id)}
                    className="text-dark-700 hover:text-dark-900"
                  >
                    {expandedSections.includes(section._id) ? (
                      <FiChevronUp className="w-5 h-5" />
                    ) : (
                      <FiChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <h3 className="font-semibold text-dark-900">{section.sectionName}</h3>
                  <span className="text-sm text-dark-600">
                    ({section.SubSection?.length || 0} lectures)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditSection(section)}
                    className="p-2 text-dark-700 hover:bg-dark-200 rounded transition"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subsections */}
              {expandedSections.includes(section._id) && (
                <div className="p-4 border-t border-dark-200">
                  <button
                    onClick={() => handleAddLecture(section._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-dark-100 text-dark-900 rounded-md hover:bg-dark-200 transition mb-3 text-sm"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Lecture
                  </button>
                  
                  {section.SubSection?.length === 0 ? (
                    <p className="text-dark-700 text-sm">No lectures in this section yet</p>
                  ) : (
                    <div className="space-y-2">
                      {section.SubSection?.map((subsection, index) => (
                        <div
                          key={subsection._id}
                          className="flex items-center justify-between p-3 bg-white rounded border border-dark-200"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm text-dark-600">
                              {index + 1}.
                            </span>
                            <div>
                              <p className="font-medium text-dark-900">{subsection.title}</p>
                              <p className="text-xs text-dark-600">
                                {subsection.timeDuration}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditLecture(section._id, subsection)}
                              className="p-2 text-dark-700 hover:bg-dark-200 rounded transition"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* SubSection Modal */}
      {showSubSectionModal && (
        <SubSectionModal
          sectionId={currentSectionId}
          course={course}
          setCourse={setCourse}
          onClose={() => setShowSubSectionModal(false)}
          subsection={editingSubSection}
        />
      )}
    </div>
  );
};

export default CourseBuilder;

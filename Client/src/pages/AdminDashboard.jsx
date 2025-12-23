import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAllCategories, createCategory, deleteCategory } from "../services/operations/categoryAPI";

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.accountType !== "Admin") {
      toast.error("Access Denied: Admin Only");
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const result = await getAllCategories();
    if (result) {
      setCategories(result);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error("All fields are required");
      return;
    }

    const result = await createCategory(formData, token);
    if (result) {
      toast.success("Category created successfully");
      setFormData({ name: "", description: "" });
      setShowModal(false);
      fetchCategories();
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const result = await deleteCategory(categoryId, token);
      if (result) {
        toast.success("Category deleted successfully");
        fetchCategories();
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-dark-400">Manage categories and platform settings</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="bg-dark-100 rounded-xl border border-dark-200 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">All Categories</h2>
          
          {categories.length === 0 ? (
            <p className="text-dark-400 text-center py-8">No categories found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-dark-200 rounded-lg p-4 border border-dark-300 hover:border-primary-500 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-dark-400 text-sm">{category.description}</p>
                  <div className="mt-3 text-xs text-dark-500">
                    Courses: {category.courses?.length || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Category Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-dark-100 rounded-xl p-8 max-w-md w-full mx-4 border border-dark-200">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Category</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-800 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-md text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-800 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter category description"
                    rows="4"
                    className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-md text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ name: "", description: "" });
                    }}
                    className="flex-1 px-4 py-3 bg-dark-300 text-white rounded-md hover:bg-dark-400 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

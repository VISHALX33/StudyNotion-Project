import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-50/95 border-b border-dark-200 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-primary-500">Study</span>
              <span className="text-white">Notion</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-end gap-8">
            {["Home", "Catalog", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-dark-600 hover:text-primary-500 transition font-medium"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {token === null ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-dark-800 hover:text-primary-500 transition font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user?.accountType === "Student" && (
                  <Link to="/dashboard/cart" className="relative">
                    <ShoppingCart className="w-6 h-6 text-dark-800 hover:text-primary-500 transition" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    <img
                      src={user?.image}
                      alt={user?.firstName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-dark-200"
                    />
                    <ChevronDown className="w-4 h-4 text-dark-800" />
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-dark-100 rounded-lg shadow-lg border border-dark-200 py-2">

                      <div className="px-4 py-2 border-b border-dark-200">
                        <p className="font-semibold text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-dark-400">{user?.email}</p>
                      </div>

                      {[
                        {
                          label: "Dashboard",
                          path:
                            user?.accountType === "Admin"
                              ? "/dashboard/admin"
                              : user?.accountType === "Instructor"
                              ? "/dashboard/instructor"
                              : "/dashboard/student",
                        },
                        user?.accountType === "Instructor" && {
                          label: "My Courses",
                          path: "/dashboard/my-courses",
                        },
                        user?.accountType === "Instructor" && {
                          label: "Create Course",
                          path: "/dashboard/add-course",
                        },
                        user?.accountType === "Student" && {
                          label: "Enrolled Courses",
                          path: "/dashboard/enrolled-courses",
                        },
                        user?.accountType === "Admin" && {
                          label: "Manage Categories",
                          path: "/dashboard/admin",
                        },
                        { label: "My Profile", path: "/dashboard/my-profile" },
                        { label: "Settings", path: "/dashboard/settings" },
                      ]
                        .filter(Boolean)
                        .map((item) => (
                          <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setShowProfileDropdown(false)}
                            className="block px-4 py-2 text-white hover:bg-dark-200 hover:text-primary-400 transition"
                          >
                            {item.label}
                          </Link>
                        ))}

                      <div className="border-t border-dark-200 my-1" />

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          localStorage.clear();
                          window.location.href = "/";
                        }}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-dark-800 hover:text-primary-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-dark-200">
            <div className="flex flex-col gap-3">
              {["Home", "Catalog", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-2 text-dark-800 hover:bg-dark-100 hover:text-white transition rounded"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

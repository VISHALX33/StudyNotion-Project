import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendOtp } from "../services/operations/authAPI";
import { setSignupData } from "../redux/slices/authSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [accountType, setAccountType] = useState("Student");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords Do Not Match");
      return;
    }

    const signupData = {
      ...formData,
      accountType,
    };

    dispatch(setSignupData(signupData));
    dispatch(sendOtp(formData.email, navigate));

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType("Student");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-dark-900">
            Join the millions learning to code with StudyNotion for free
          </h2>
          <p className="mt-2 text-dark-700">
            Build skills for today, tomorrow, and beyond.{" "}
            <span className="text-primary-500 font-semibold">
              Education to future-proof your career.
            </span>
          </p>
        </div>

        {/* Student-Instructor-Admin tabs */}
        <div className="flex bg-dark-100 p-1 gap-x-1 rounded-full border border-dark-200">
          <button
            className={`${
              accountType === "Student"
                ? "bg-dark-50 text-dark-900"
                : "bg-transparent text-dark-600"
            } py-2 px-5 rounded-full transition-all duration-200 w-full`}
            onClick={() => setAccountType("Student")}
          >
            Student
          </button>
          <button
            className={`${
              accountType === "Instructor"
                ? "bg-dark-50 text-dark-900"
                : "bg-transparent text-dark-600"
            } py-2 px-5 rounded-full transition-all duration-200 w-full`}
            onClick={() => setAccountType("Instructor")}
          >
            Instructor
          </button>
          <button
            className={`${
              accountType === "Admin"
                ? "bg-dark-50 text-dark-900"
                : "bg-transparent text-dark-600"
            } py-2 px-5 rounded-full transition-all duration-200 w-full`}
            onClick={() => setAccountType("Admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleOnSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-x-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-dark-800 mb-2">
                  First Name <sup className="text-red-500">*</sup>
                </label>
                <input
                  required
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={handleOnChange}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-md text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-dark-800 mb-2">
                  Last Name <sup className="text-red-500">*</sup>
                </label>
                <input
                  required
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={handleOnChange}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-md text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-800 mb-2">
                Email Address <sup className="text-red-500">*</sup>
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter email address"
                className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-md text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-x-4">
              <div className="flex-1">
                <label htmlFor="password" className="block text-sm font-medium text-dark-800 mb-2">
                  Create Password <sup className="text-red-500">*</sup>
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter Password"
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-md text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-dark-600"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible fontSize={24} />
                    ) : (
                      <AiOutlineEye fontSize={24} />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-800 mb-2">
                  Confirm Password <sup className="text-red-500">*</sup>
                </label>
                <div className="relative">
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-md text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-dark-600"
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible fontSize={24} />
                    ) : (
                      <AiOutlineEye fontSize={24} />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

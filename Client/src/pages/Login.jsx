import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../services/operations/authAPI";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-dark-900">Welcome Back</h2>
          <p className="mt-2 text-dark-700">
            Build skills for today, tomorrow, and beyond.{" "}
            <span className="text-primary-500 font-semibold">
              Education to future-proof your career.
            </span>
          </p>
        </div>

        <form onSubmit={handleOnSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-800 mb-2">
                Password <sup className="text-red-500">*</sup>
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

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition font-semibold"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-dark-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

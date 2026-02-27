import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setMessage("");
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (id === 'email' && value && !validateEmail(value)) {
      setErrors({ ...errors, email: 'Please enter a valid email format.' });
    } else if (id === 'confirmPassword' && value && value !== formData.password) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // --- UPDATED: Password validation logic ---
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) { // Checks for an uppercase letter
      errors.push("contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) { // Checks for a lowercase letter
      errors.push("contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("contain at least one number");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("contain at least one special character (@$!%*?&)");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setMessage("❌ Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email format.' });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      let errorMessage = "❌ Password must ";
      if (passwordErrors.length === 1) {
        errorMessage += passwordErrors[0];
      } else {
        errorMessage +=
          passwordErrors.slice(0, -1).join(", ") +
          " and " +
          passwordErrors.slice(-1);
      }
      setMessage(errorMessage + ".");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Account created successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          navigate("/sign-in");
        }, 1500);
      } else {
        setMessage(result.message || "❌ Something went wrong.");
      }
    } catch (error) {
      setMessage("❌ Failed to connect to server.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-slate-700">
          Create Account
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border-2 border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          {/* Email Input */}
          <div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-slate-400'}`}
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 border-2 border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          {/* Confirm Password Input */}
          <div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-10 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-slate-400'}`}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 cursor-pointer"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-400 to-red-400 text-white py-2 rounded-lg font-semibold shadow-md transition duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
          <OAuth />
        </form>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-green-600 hover:underline font-medium"
          >
            Sign In
          </Link>
        </div>

        {message && (
          <div
            className={`text-center text-sm mt-2 px-4 py-2 rounded-md font-medium transition ${
              message.startsWith("✅")
                ? "text-green-700 bg-green-100 border border-green-300"
                : "text-red-600 bg-red-100 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

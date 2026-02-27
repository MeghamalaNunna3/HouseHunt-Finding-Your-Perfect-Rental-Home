import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// --- 1. Import Redux hooks and actions ---
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'; 
import OAuth from "../components/OAuth";


export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // --- 2. Get global state from Redux instead of local state ---
  const { loading, error: message } = useSelector((state) => state.user);

  const navigate = useNavigate();
  // --- 3. Get the dispatch function ---
  const dispatch = useDispatch();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) setErrors({ ...errors, [id]: "" });
  };

  const handleBlur = (e) => {
    if (e.target.id === 'email' && e.target.value && !validateEmail(e.target.value)) {
      setErrors({ ...errors, email: 'Please enter a valid email format.' });
    }
  };

  // --- 4. Update handleSubmit to dispatch actions ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill in all fields."));
    }
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email format.' });
      return;
    }

    try {
      dispatch(signInStart()); // Set loading = true, clear previous errors
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rememberMe }),
      });
      const result = await response.json();
      
      if (response.ok) {
        // On success, dispatch the user data to the store
        // console.log("SignIn result:", result);
        dispatch(signInSuccess(result));
        navigate("/");
      } else {
        // On failure, dispatch the error message
        dispatch(signInFailure(result.message || "Something went wrong."));
      }
    } catch (error) {
      dispatch(signInFailure("Failed to connect to server."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-slate-700">
          Welcome Back!
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative">
             <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
             <input type="email" id="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="Email" className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-slate-400'}`} />
          </div>
          {errors.email && <p className="text-red-600 text-xs -mt-3 ml-1">{errors.email}</p>}
          
          {/* Password Input */}
          <div className="relative">
             <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
             <input type={showPassword ? "text" : "password"} id="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full pl-10 pr-10 py-2 border-2 border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
             <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 cursor-pointer" title={showPassword ? "Hide password" : "Show password"}>
               {showPassword ? <FaEyeSlash /> : <FaEye />}
             </span>
          </div>

           {/* Remember me */}
          <div className="flex items-center justify-between text-sm">
             <div className="flex items-center gap-2">
               <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
               <label htmlFor="rememberMe" className="text-slate-600 select-none cursor-pointer">Remember me</label>
             </div>
          </div>

        

          {/* --- 5. Use the global `loading` state from Redux --- */}
          <button type="submit" disabled={loading} className={`w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-2 rounded-lg font-semibold shadow-md transition duration-300 ${ loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90" }`}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <OAuth />
        </form>

        <div className="text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-indigo-600 hover:underline font-medium">Sign Up</Link>
        </div>

        {/* --- 6. Display the global `error` message from Redux --- */}
        {message && (
          <div className="text-center text-sm mt-2 px-4 py-2 rounded-md font-medium transition text-red-600 bg-red-100 border border-red-300">
            {message}
          </div>
        )}
      </div>

      <style>{`
        /* ... your keyframes ... */
      `}</style>
    </div>
  );
}
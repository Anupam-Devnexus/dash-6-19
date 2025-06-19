import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email.";

    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = "Phone must be 10 digits.";

    if (!password.trim()) newErrors.password = "Password is required.";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Confirm your password.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(
        "http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          console.log("Sending signup data:", formData);
          console.log("Token: ", data.token);
        }
        toast.success("Signup successful!", { autoClose: 2000 });
        setTimeout(() => navigate("/admin/dashboard"), 2000);
      } else {
        toast.error(data.message || "Signup failed. Please try again.", {
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { autoClose: 3000 });
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white opacity-100">
      <section className="flex flex-col md:flex-col lg:flex-row items-center justify-center h-screen max-w-full w-full max-h-screen overflow-auto rounded-xl">
        {/* Text Section */}
        <div className="w-full lg:w-full text-center lg:text-left space-y-6 px-4 max-w-3xl mx-auto lg:mx-0">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight tracking-tight">
            Join Us at{" "}
            <span className="text-[var(--var-red-col)]">Cervino Ceramix</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
            Sign up to explore our product dashboard, manage bids, check
            inventory, and track your orders with ease.
          </p>
        </div>

        {/* Signup Form */}
        <div className="shadow-2xl rounded-2xl bg-white p-8 w-full max-w-md mx-auto mt-10 lg:mt-0">
          <h2 className="text-2xl font-bold text-[var(--var-red-col)] text-center mb-6">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-[var(--var-red-col)] cursor-pointer text-white py-3 rounded-lg w-full hover:bg-red-900 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm mt-6 text-center">
            Already registered?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[var(--var-red-col)] hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </section>

      <ToastContainer position="top-right" />
    </div>
  );
}

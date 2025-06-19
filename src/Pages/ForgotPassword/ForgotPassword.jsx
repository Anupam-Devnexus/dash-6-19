import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert(`Reset link sent to ${email}`);
    setEmail("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row items-center justify-center min-h-[80vh] max-w-6xl w-full p-8 gap-10">

        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-1 px-4">
          <button
            onClick={() => navigate("/login")}
            className="inline-block mb-4 text-sm font-semibold text-[var(--var-red-col)] hover:underline focus:outline-none"
          >
            &larr; Back to Login
          </button>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-[var(--var-red-col)]">
            Trouble Logging In?
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto md:mx-0">
            Don’t worry — we’ve got you covered. Just enter the email address you used to register,
            and we’ll send you a link to reset your password.
          </p>

          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto md:mx-0">
            Be sure to check your spam or junk folder if you don’t see the email within a few minutes.
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="w-full md:w-1/2 max-w-md mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--var-red-col)] mb-6">
              Forgot Password
            </h2>

            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Registered Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] focus:border-[var(--var-red-col)] transition"
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--var-red-col)] text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { GrLinkNext } from "react-icons/gr";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center opacity-100">
      <section className="bg-white shadow-2xl flex items-center justify-center h-screen max-w-full w-full">
        <div className="flex flex-col-reverse lg:flex-row gap-6 items-center">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight tracking-tight">
              Welcome to{" "}
              <span className="text-[var(--var-red-col)]">Cervino Ceramix !</span>
            </h1>

            <div className="flex justify-center lg:justify-start pt-4">
              <button
                onClick={() => navigate("/login")}
                className="group cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-[var(--var-red-col)] text-white rounded-full text-sm sm:text-base font-semibold shadow-lg hover:bg-red-700 transition-all duration-300"
              >
                Let’s Get Started
                <GrLinkNext className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="w-full p-4 lg:w-1/2 flex justify-center items-center">
            <div className="w-full max-w-md sm:max-w-lg">
              <img
                src="https://res.cloudinary.com/dy6a2ncau/image/upload/v1748258320/WhatsApp_Image_2025-05-26_at_4.48.11_PM_uicgrp.jpg"
                alt="Cervino Ceramix Product"
                className="w-full h-auto rounded-2xl shadow-gray-800 shadow-lg object-cover transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

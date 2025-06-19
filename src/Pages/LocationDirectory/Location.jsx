import React from "react";
import Contact from "../../Components/Card/ContactOffices";
import { useNavigate } from "react-router-dom";

export default function Location() {
  const navigate = useNavigate();

  
  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl text-[var(--var-red-col)] font-bold">
          Our Offices
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <button
            onClick={() => navigate("/admin/location/addLocationDirectory")}
            className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-[var(--var-red-col)] text-white rounded-md hover:bg-red-700 transition"
          >
            Add To Location Directory
          </button>
          {/* <button
            onClick={() => navigate("/admin/location/addLocation")}
            className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-[var(--var-red-col)] text-white rounded-md hover:bg-red-700 transition"
          >
            Add New Office
          </button> */}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-2">
        <Contact />
      </div>
    </div>
  );
}

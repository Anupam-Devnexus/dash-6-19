import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddAchievement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projects: 100,
    variants: 100,
    years: 20,
    countries: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://your-api-url.com/api/achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit achievement data");
      }

      const data = await response.json();
      console.log("Success:", data);

      // Optional: navigate or show a message
      alert("Achievement added successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add achievement. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Achievement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["projects", "variants", "years", "countries"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 capitalize mb-1">
              {field}
            </label>
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="px-3 py-1 border-[1px] cursor-pointer border-[var(--var-red-col)] bg-gray-100 hover:bg-[var(--var-red-col)] hover:text-white rounded"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-3 py-1 cursor-pointer text-white rounded"
            style={{
              backgroundColor: "var(--var-red-col)",
              transition: "background-color 0.3s",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

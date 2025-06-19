import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPortfolio() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buildingName: "",
    place: "",
    imageUrl: "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "imageUrl" ? { imageFile: null } : {}),
    }));
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: "",
      }));
      setErrorMsg("");
      setSuccessMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // get token from localStorage

    if (!token) {
      alert("You must be logged in to submit a review.");
      return;
    }

    if (!formData.buildingName.trim() || !formData.place.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!formData.imageUrl && !formData.imageFile) {
      setErrorMsg("Please provide an image URL or upload an image.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    console.log("Submitting review with data:", {
      ...formData,
      token,
    });

    try {
  let response;

  if (formData.imageFile) {
    const multipartData = new FormData();
    multipartData.append("buildingName", formData.buildingName);
    multipartData.append("place", formData.place);
    multipartData.append("imageFile", formData.imageFile);

    response = await fetch("http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/portfolio/addPortfolio", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Don't set Content-Type when using FormData — browser sets it with boundary
      },
      body: multipartData,
    });
  } else {
    response = await fetch("https://cervino-ceramix-backend-production.up.railway.app/admin/portfolio", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buildingName: formData.buildingName,
        place: formData.place,
        imageUrl: formData.imageUrl,
      }),
    });
  }

  if (!response.ok) throw new Error("Failed to add portfolio.");

  await response.json();
  setSuccessMsg("Portfolio added successfully!");
  setFormData({
    buildingName: "",
    place: "",
    imageUrl: "",
    imageFile: null,
  });

  setTimeout(() => navigate("/admin/portfolio"), 1500);
} catch (error) {
  setErrorMsg(error.message || "Something went wrong.");
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 sm:p-12">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-[var(--var-red-col)]">
          Add New Portfolio
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="buildingName" className="block text-gray-700 font-semibold mb-2">
              Building Name <span className="text-red-500">*</span>
            </label>
            <input
              id="buildingName"
              type="text"
              name="buildingName"
              value={formData.buildingName}
              onChange={handleChange}
              placeholder="e.g., Cervino Tower"
              className="w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-1 focus:ring-[var(--var-red-col)] focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="place" className="block text-gray-700 font-semibold mb-2">
              Place <span className="text-red-500">*</span>
            </label>
            <input
              id="place"
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              placeholder="e.g., Zermatt, Switzerland"
              className="w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-1 focus:ring-[var(--var-red-col)] focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-gray-700 font-semibold mb-2">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Paste image URL here"
              className={`w-full border rounded-md p-3 text-gray-900 focus:ring-1 focus:ring-[var(--var-red-col)] focus:outline-none transition
                ${formData.imageFile ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={!!formData.imageFile}
            />
          </div>

          <div>
            <label htmlFor="imageFile" className="block text-gray-700 font-semibold mb-2">
              Or Upload Image
            </label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full cursor-pointer ${formData.imageUrl ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={!!formData.imageUrl}
            />
          </div>

          {errorMsg && (
            <p className="text-red-600 font-medium mt-2 text-center">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="text-green-600 font-medium mt-2 text-center">{successMsg}</p>
          )}

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/portfolio")}
              className="px-4 cursor-pointer py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-3 py-1 cursor-pointer rounded-md text-white font-semibold transition
              ${loading
                  ? "bg-[var(--var-red-col)] opacity-60 cursor-not-allowed"
                  : "bg-[var(--var-red-col)] hover:bg-red-700"
                }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Portfolio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function EditPortfolio({ onEdit, onDelete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Try to get building from route state
  const buildingFromState = location.state;

  // Local state for building data
  const [building, setBuilding] = useState(buildingFromState || null);

  // Form state
  const [formData, setFormData] = useState({
    buildingName: "",
    place: "",
    imageFile: null,
    previewUrl: "",
  });

  // Confirm delete prompt removed, just delete directly on click now
  // Modal state removed

  // Fetch building if not passed via location.state
  useEffect(() => {
    if (!building && id) {
      // Simulate fetch delay and dummy data
      setTimeout(() => {
        const dummyData = {
          id,
          buildingName: "Dummy Building",
          place: "Dummy Place",
          image: "https://via.placeholder.com/400x300",
        };
        setBuilding(dummyData);
      }, 500);
    }
  }, [id, building]);

  // Initialize form when building data is ready
  useEffect(() => {
    if (building) {
      setFormData({
        buildingName: building.buildingName || "",
        place: building.place || "",
        imageFile: null,
        previewUrl: building.image || "",
      });
    }
  }, [building]);

  // Loading fallback
  if (!building) {
    return <div className="p-4 text-center">Loading building data...</div>;
  }

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("id", building.id);
    form.append("buildingName", formData.buildingName);
    form.append("place", formData.place);
    if (formData.imageFile) {
      form.append("image", formData.imageFile);
    }

    try {
      const response = await fetch("https://your-api.com/update", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        alert("Building updated successfully!");
        if (onEdit) onEdit(building.id);
        navigate("/admin/portfolio"); // redirect after save
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-bold mb-6">Edit Building</h2>

      <label className="block mb-3">
        <span className="block mb-1 font-medium">Building Name</span>
        <input
          type="text"
          name="buildingName"
          value={formData.buildingName}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          placeholder="Building Name"
        />
      </label>

      <label className="block mb-3">
        <span className="block mb-1 font-medium">Place</span>
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          placeholder="Place"
        />
      </label>

      <label className="block mb-4">
        <span className="block mb-1 font-medium">Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />
      </label>

      {formData.previewUrl && (
        <img
          src={formData.previewUrl}
          alt="Preview"
          className="h-40 w-full object-cover rounded mb-6"
        />
      )}

      <div className="flex gap-4 justify-end">
        <button
          onClick={() => navigate("/admin/portfolio")}
          className="px-3 py-1 cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-3 cursor-pointer py-1 bg-[var(--var-red-col)] text-white rounded hover:bg-red-700"
        >
          Save
        </button>

       
      </div>
    </div>
  );
}

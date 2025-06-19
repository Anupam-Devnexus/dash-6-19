import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditB() {
  const location = useLocation();
  const navigate = useNavigate();
  const brochure = location.state?.brochure;

  const [formData, setFormData] = useState({
    text: "",
    image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (brochure) {
      setFormData({
        text: brochure.text || "",
        image: brochure.image || "",
      });
      setPreviewUrl(brochure.image || "");
    }
  }, [brochure]);

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Convert file to base64 string helper
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brochure || !brochure.id) {
      alert("Original brochure info is missing or incomplete.");
      return;
    }

    try {
      let imageToSend = formData.image;

      if (selectedFile) {
        imageToSend = await toBase64(selectedFile);
      }

      const updatedBrochure = {
        ...formData,
        image: imageToSend,
      };

      // Replace with your real API endpoint
      const response = await fetch(`https://fakeapi.com/brochures/${brochure.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBrochure),
      });

      if (!response.ok) {
        throw new Error(`Failed to update brochure: ${response.statusText}`);
      }

      setSuccessMessage("Brochure updated successfully!");

      setTimeout(() => {
        navigate("/admin/brochures");
      }, 1500);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!brochure) {
    return (
      <div className="p-6 text-red-600 font-semibold text-center">
        No brochure data found to edit. Please navigate from the Brochures page.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-4 bg-white shadow-md rounded-md mt-4">
      <h2 className="text-2xl font-bold mb-6 text-[var(--var-red-col)]">Edit Brochure</h2>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-semibold text-gray-700">
            Brochure Name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="image" className="mb-2 font-semibold text-gray-700">
            Image
          </label>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Brochure preview"
                className="h-36 object-cover rounded border border-gray-300"
              />
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/brochures")}
            className="px-6 py-2 bg-white text-[var(--var-red-col)] border border-[var(--var-red-col)] rounded-md hover:bg-[var(--var-red-col)] hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--var-red-col)] text-white rounded-md hover:bg-red-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

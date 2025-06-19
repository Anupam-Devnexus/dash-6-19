import React, { useState, useEffect } from "react";

export default function UpdateBrochure({ isOpen, brochure, onSave, onCancel }) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (brochure) {
      setText(brochure.text);
      setPreviewUrl(brochure.image); // Show current image if available
    }
  }, [brochure]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // for local preview
  };

  const handleSave = async () => {
    if (!text.trim() || (!imageFile && !previewUrl)) {
      alert("Please provide both name and image");
      return;
    }

    try {
      let imageUrl = previewUrl;

      // OPTIONAL: Upload image to cloud and get URL
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // required for services like Cloudinary

        const response = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        imageUrl = data.secure_url;
      }

      onSave({ ...brochure, text, image: imageUrl });
    } catch (err) {
      alert("Failed to upload image");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8 z-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">Update Brochure</h2>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col text-left font-medium">
            Brochure Name
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 border border-gray-300 rounded px-3 py-2"
              placeholder="Enter brochure name"
            />
          </label>

          <label className="flex flex-col text-left font-medium">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 border border-gray-300 rounded px-3 py-2"
            />
          </label>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-40 object-cover rounded border"
            />
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-white text-[var(--var-red-col)] border border-[var(--var-red-col)] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-[var(--var-red-col)] text-white transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

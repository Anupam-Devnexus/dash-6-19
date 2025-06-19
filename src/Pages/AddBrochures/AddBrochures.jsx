import React, { useState } from "react";

export default function AddBrochures() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };
 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setMessage("Please enter brochure name");
      return;
    }
    if (!imageFile) {
      setMessage("Please upload an image");
      return;
    }

    const token = localStorage.getItem("token"); // get token from local storage

    // Log the data before submission
    console.log("Submitting brochure with data:");
    console.log("Name:", text.trim());
    console.log("BrochuresImage", imageFile);
    console.log("Token:", token);

    const formData = new FormData();
    formData.append("title", text.trim());
    formData.append("BrochuresImage", imageFile);

    try {
      const response = await fetch("http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/addBrochures", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setMessage("Brochure added successfully!");
      setText("");
      setImageFile(null);
    } catch (error) {
      setMessage(`Failed to add brochure: ${error.message}`);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8 sm:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-[var(--var-red-col)]">
          Add New Brochure
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col text-gray-700 font-medium">
            Brochure Name
            <input
              type="text"
              name="title"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter brochure name"
              className="mt-2 px-4 py-3 border-b border-gray-300  outline-none"
              required
            />
          </label>

          <label className="flex flex-col text-gray-700 font-medium">
            Upload Image
            <input
              type="file"
              name="BrochuresImage"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 rounded-lg cursor-pointer border-2 border-dashed border-[var(--var-red-col)] p-4 text-gray-500 hover:bg-[var(--var-red-col)] hover:text-white transition"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-[var(--var-red-col)] hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Add Brochure
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center font-semibold ${
              message.includes("Failed") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

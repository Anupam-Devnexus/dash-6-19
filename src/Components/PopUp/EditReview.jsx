import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditReview() {
  const { clientname } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clientname: "",
    profilePicture: "",
    reviewHead: "",
    review: "",
    star: 1,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const reviewData = reviews.find((r) => r.clientname === clientname);

    if (reviewData) {
      setForm(reviewData);
      setPreviewUrl(reviewData.profilePicture || "");
    } else {
      navigate("/reviews");
    }
  }, [clientname, navigate]);

  // Cleanup previous preview URL when imageFile changes
  useEffect(() => {
    if (!imageFile) return;

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "star" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = form.profilePicture;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // Replace with actual preset

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", // Replace with your Cloudinary cloud name
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        imageUrl = data.secure_url;
      } catch (err) {
        alert("Image upload failed");
        return;
      }
    }

    const updatedReview = { ...form, profilePicture: imageUrl };
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const updatedReviews = reviews.map((r) =>
      r.clientname === clientname ? updatedReview : r
    );

    localStorage.setItem("reviews", JSON.stringify(updatedReviews));

    setSuccessMessage("Review updated successfully!");

    setTimeout(() => {
      navigate("/reviews");
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">✏️ Edit Review</h2>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="clientname"
          value={form.clientname}
          onChange={handleChange}
          placeholder="Client Name"
          className="w-full border p-2 rounded"
          required
          readOnly
        />

        <label className="block">
          <span className="text-sm font-medium">Profile Picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full mt-1 border p-2 rounded"
          />
        </label>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover border mx-auto"
          />
        )}

        <input
          name="reviewHead"
          value={form.reviewHead}
          onChange={handleChange}
          placeholder="Review Heading"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="review"
          value={form.review}
          onChange={handleChange}
          placeholder="Review"
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <input
          name="star"
          type="number"
          value={form.star}
          onChange={handleChange}
          min={1}
          max={5}
          className="w-full border p-2 rounded"
          required
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/reviews")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[var(--var-red-col)] text-white rounded hover:bg-red-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditR() {
  const { clientname } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialReview = location.state?.review;

  const [form, setForm] = useState({
    // _id: "",
    clientname: "",
    profilePicture: "",
    star: 1,
    reviewHead: "",
    review: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (initialReview) {
      setForm(initialReview);
      setPreviewUrl(initialReview.profilePicture || "");
    } else {
      alert("Review data not found!");
      navigate("/admin/review");
    }
  }, [initialReview, navigate]);

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

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Unauthorized! Please login again.");
    return;
  }

  const formData = new FormData();
  
  // Append all fields including _id for the backend
  formData.append("_id", form._id);
  formData.append("clientname", form.clientname);
  formData.append("star", form.star.toString());
  formData.append("reviewHead", form.reviewHead);
  formData.append("review", form.review);
  
  // Only append image if a new one was selected
  if (imageFile) {
    formData.append("profilePicture", imageFile);
  }
  console.log("Form Data-", form)

  try {
    const response = await fetch(
      `http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/update-review/${form._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Backend error details:", result);
      throw new Error(result.message || "Failed to update review.");
    }

    toast.success("Review updated successfully!", {
      position: "top-right",
      autoClose: 1500,
    });

    setTimeout(() => navigate("/admin/review"), 1800);
  } catch (error) {
    console.error("Full error:", error);
    toast.error(error.message || "Something went wrong while updating the review.", {
      position: "top-right",
    });
  }
};

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow-md mt-3">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4 text-[var(--var-red-col)]">
        ✏️ Edit Client Review
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Client Name</label>
          <input
            name="clientname"
            value={form.clientname}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 mt-3 rounded-full object-cover border"
            />
          )}
        </div>
          <div>
          <label className="block text-sm font-medium mb-1">Stars (1–5)</label>
          <input
            name="star"
            type="number"
            min={1}
            max={5}
            value={form.star}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Review Heading</label>
          <input
            name="reviewHead"
            value={form.reviewHead}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

      

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Review</label>
          <textarea
            name="review"
            value={form.review}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/review")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--var-red-col)] text-white rounded hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

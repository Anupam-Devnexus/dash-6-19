import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddReview() {
  const [formData, setFormData] = useState({
    clientname: '',
    profilePicture: null,
    star: 5,
    reviewHead: '',
    review: '',
  });

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  // Create preview URL when profilePicture changes
  useEffect(() => {
    if (!formData.profilePicture) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(formData.profilePicture);
    setPreview(objectUrl);

    // Clean up the object URL when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.profilePicture]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePicture') {
      setFormData((prev) => ({
        ...prev,
        profilePicture: files && files[0] ? files[0] : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'star' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // get token from localStorage

    if (!token) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("clientname", formData.clientname);
    if (formData.profilePicture) {
      formDataToSubmit.append("profilePicture", formData.profilePicture);
    }
    formDataToSubmit.append("star", formData.star);
    formDataToSubmit.append("reviewHead", formData.reviewHead);
    formDataToSubmit.append("review", formData.review);


    console.log("Submitting review with data:", {
      ...formData,
      token,
      profilePictureUrl: formData.profilePicture || "No image provided",
    });

    try {
      const response = await fetch(
        "http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/review/addReview",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSubmit,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Review Submitted:", result);
        console.log("Token", token)
        alert("Review submitted successfully!");

        // Optional: fetch all reviews
        const allReviewsResponse = await fetch(
          "http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/review",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (allReviewsResponse.ok) {
          const allReviews = await allReviewsResponse.json();
          console.log("All Reviews:", allReviews);
        } else {
          console.error("Failed to fetch all reviews");
        }

        // Reset form and redirect
        setFormData({
          clientname: "",
          profilePicture: null,
          star: 5,
          reviewHead: "",
          review: "",
        });
        setPreview(null);
        navigate("/admin/review");
      } else {
        const errorRes = await response.json();
        console.error("Failed to submit review:", errorRes.message);
        alert(errorRes.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md my-8">
      <h2 className="text-2xl text-[var(--var-red-col)] font-semibold mb-8 text-center">Add Your Review</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="clientname">
            Name
          </label>
          <input
            type="text"
            id="clientname"
            name="clientname"
            value={formData.clientname}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="profilePicture">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="star">
            Star Rating
          </label>
          <select
            id="star"
            name="star"
            value={formData.star}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Star{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="reviewHead">
            Review Title
          </label>
          <input
            type="text"
            id="reviewHead"
            name="reviewHead"
            value={formData.reviewHead}
            onChange={handleChange}
            placeholder="Summary of your review"
            required
            className="border-b border-[var(--var-red-col)] px-3 py-2 outline-none"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-medium mb-1" htmlFor="review">
            Review
          </label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            placeholder="Write your detailed review here"
            rows={5}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-[var(--var-red-col)] text-white font-semibold py-3 rounded hover:bg-green-700 cursor-pointer transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}

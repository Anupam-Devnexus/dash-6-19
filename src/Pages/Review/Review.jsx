import React, { useEffect, useState } from "react";
import ReviewCard from "../../Components/Card/ReviewCard";
import Confirm from "../../Components/PopUp/Confirm";
import { useNavigate } from "react-router-dom";
import GetReview from "../../Zustand/GetApi/GetReview/GetReview";
import { toast } from "react-toastify";

export default function Review() {
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const navigate = useNavigate();

  const { loading, error, reviewList, fetchReview } = GetReview();

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);
  console.log(reviewList)

  // Edit review - navigate to edit page
  const handleEdit = (review) => {
    navigate(`/admin/update-review/${encodeURIComponent(review._id)}`, {
      state: { review },
    });
  };

  // Trigger confirm popup
  const handleDelete = (review) => {
    setReviewToDelete(review);
  };

  // Confirm deletion (You can later connect with API to actually delete from DB)
  const confirmDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    const response = await fetch(
      `http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/review/${reviewToDelete._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete review");
    }

    toast.success(` ${reviewToDelete.clientname}'s review deleted successfully!`);
    fetchReview();
    setReviewToDelete(null);
  } catch (error) {
    toast.error(` ${error.message || "Something went wrong while deleting."}`);
    console.error("Delete review error:", error);
    setReviewToDelete(null);
  }
};



  // Cancel deletion
  const cancelDelete = () => {
    setReviewToDelete(null);
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="flex bg-[var(--var-red-col)] items-center p-2 justify-between">
        <h1 className="text-lg text-white font-bold">
          📝 Client Reviews ({reviewList?.length || 0})
        </h1>
        <button
          onClick={() => navigate("/admin/review/addReview")}
          className="cursor-pointer px-3 py-1 bg-[var(--var-red-col)] text-white font-semibold rounded-md"
        >
          Add Review
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 py-10">
          Loading reviews...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 py-10">
          Failed to load reviews. Please try again.
        </div>
      )}

      {/* Review List */}
      {!loading && !error && (
        <div className="space-y-4">
          {reviewList.length > 0 ? (
            reviewList.map((review,index) => (
              <ReviewCard
                key={index}
                review={review}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">
              No reviews available.
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <Confirm
          isOpen={Boolean(reviewToDelete)}
          clientName={reviewToDelete.clientname}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

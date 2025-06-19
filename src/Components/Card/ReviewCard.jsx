import React from "react";
import { Pencil, Trash2, Star } from "lucide-react";

export default function ReviewCard({ review, onDelete, onEdit }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-500 fill-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-lg">
      {/* Client Info */}
      <div className="flex items-center gap-4 flex-1">
        <img
          src={review.profilePicture}
          alt={review.clientname}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h3 className="font-semibold text-lg">{review.clientname}</h3>
          <p className="text-sm text-gray-600">{review.position}</p>
          <div className="flex mt-1">{renderStars(review.star)}</div>
        </div>
      </div>

      {/* Review Text */}
      <div className="flex-1 text-gray-700 text-sm sm:text-base">
        "{review.review}"
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(review)}
          className="flex items-center gap-1 border-[1px] cursor-pointer border-[var(--var-red-col)] bg-white text-[var(--var-red-col)] px-3 py-1 rounded-md transition text-sm"
        >
          <Pencil size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(review)}
          className="flex items-center gap-1 bg-[var(--var-red-col)] cursor-pointer text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

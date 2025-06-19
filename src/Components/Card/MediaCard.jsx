import React from "react";
import { Trash2, Pencil } from "lucide-react";

export default function MediaCard({ image, text, link = "", onDelete, onEdit }) {
  const openLink = () => {
    if (link) window.open(link, "_blank");
  };

  return (
    <div
      className="relative flex flex-col cursor-pointer items-start sm:items-center bg-[var(--var-red-col)]/10 border border-[var(--var-red-col)]
      gap-4 p-4 rounded-lg shadow-md hover:shadow-lg transition"
      onClick={openLink}
    >
      {/* Top-right corner: Edit & Delete */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-[var(--var-red-col)] text-white p-1 cursor-pointer rounded hover:bg-red-700 transition"
          title="Edit Media"
        >
          <Pencil size={16} />
        </button>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-[var(--var-red-col)] text-white cursor-pointer p-1 rounded hover:bg-red-700 transition"
            title="Delete Media"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Image and label */}
      <img
        className="h-44 w-full object-cover rounded-md"
        src={image}
        alt={text}
      />
      <span className="font-light text-left text-gray-800">{text}</span>
    </div>
  );
}

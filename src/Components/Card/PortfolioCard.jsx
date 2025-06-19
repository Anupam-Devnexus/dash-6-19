import React from "react";

export default function PortfolioCard({ building, onEdit, onDelete }) {
  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-48 object-cover"
        src={
          building.imageFile instanceof File
            ? URL.createObjectURL(building.imageFile  )
            : building.imageFile  
        }
        alt={building.buildingName || "Building Image"}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">
          {building.buildingName}
        </h3>
        <p className="text-gray-600">{building.place}</p>
        <div className="flex justify-end mt-2 gap-2">
          <button
            className="px-2 py-1 bg-white text-[var(--var-red-col)] border border-[var(--var-red-col)] rounded transition-colors"
            onClick={() => onEdit(building.id)}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-[var(--var-red-col)] text-white rounded hover:bg-red-700 transition-colors"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

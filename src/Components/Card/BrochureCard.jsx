import React from "react";

export default function BrochureCard({ brochure, onDelete, onUpdate }) {
    return (
        <div className="border-[1px] border-[var(--var-red-col)] rounded-lg shadow-md overflow-hidden max-w-sm bg-white">
            <img
                src={brochure.BrochuresImage}
                alt={brochure.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{brochure.title}</h3>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => onUpdate(brochure)}
                        className="px-3 py-1 bg-white text-[var(--var-red-col)] border-[1px] cursor-pointer border-[var(--var-red-col)] rounded  transition"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => onDelete(brochure)}
                        className="px-3 py-1 bg-[var(--var-red-col)] cursor-pointer text-white rounded hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

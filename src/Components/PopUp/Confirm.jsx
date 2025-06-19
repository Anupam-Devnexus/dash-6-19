import React from "react";

export default function Confirm({ isOpen, onConfirm, onCancel,clientName ="" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 sm:p-8 text-center z-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">You want to delete - <span className="font-bold">{clientName}</span>?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-[var(--var-red-col)] cursor-pointer text-white px-4 py-2 rounded hover:bg-[var(--var-red-col)] transition w-full sm:w-auto"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-white text-[var(--var-red-col)] cursor-pointer border border-[var(--var-red-col)] px-4 py-2 rounded hover:bg-red-100 transition w-full sm:w-auto"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

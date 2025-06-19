import React from "react";

export default function DashCard({ icon, text, number }) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all">
      <div className="text-[var(--var-red-col)] text-2xl">{icon}</div>
      <div className="text-sm text-gray-600 font-medium">{text}</div>
      <div className="text-xl font-bold">{number}</div>
    </div>
  );
}

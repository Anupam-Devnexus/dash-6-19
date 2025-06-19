import React from "react";

export default function EnquiryCard({ enquiry }) {
  return (
    <div
      className="max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden my-3 border-2 transition-shadow duration-300 hover:shadow-2xl"
      style={{ borderColor: "var(--var-red-col)" }}
    >
      <div className="px-7 py-6">
        <h2
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--var-red-col)" }}
        >
          {enquiry.itemId ? `${enquiry.itemId} - ` : ""}
          {enquiry.name}
        </h2>

        <p className="text-gray-800 mb-5">{enquiry.message}</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <span
            className="px-3 py-1 rounded-full font-semibold"
            style={{
              backgroundColor: "var(--var-border-col)",
              color: "var(--var-white-text)",
              boxShadow: "0 2px 5px rgba(0, 53, 122, 0.3)",
            }}
          >
            Product: {enquiry.item}
          </span>

          <span
            className="px-3 py-1 rounded-full font-semibold capitalize"
            style={{
              backgroundColor: "var(--var-red-col)",
              color: "var(--var-text-col)",
              boxShadow: "0 2px 5px rgba(143, 20, 2, 0.4)",
            }}
          >
            Type: {enquiry.productType}
          </span>

          <span
            className="px-3 py-1 rounded-full font-semibold"
            style={{
              backgroundColor: "var(--var-gray-col)",
              color: "var(--var-white-text)",
              boxShadow: "0 2px 5px rgba(91, 86, 85, 0.4)",
            }}
          >
            Quantity: {enquiry.quantity}
          </span>
        </div>
      </div>
    </div>
  );
}

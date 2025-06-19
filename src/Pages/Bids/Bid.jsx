import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import GetBid from "../../Zustand/GetApi/GetBid/GetBid";

export default function Bid() {
  const [viewMode, setViewMode] = useState("table");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { loading, error, BidList, fetchBid } = GetBid();

  useEffect(() => {
    fetchBid();
  }, [fetchBid]);

  const toggleView = () => {
    setViewMode((prev) => (prev === "table" ? "chart" : "table"));
  };

  const filterData = () => {
    let filtered = search
      ? BidList.filter((item) =>
          item.item.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      : [...BidList];

    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.bidAmount - b.bidAmount
        : b.bidAmount - a.bidAmount
    );

    return filtered;
  };

  const filteredBids = filterData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4 bg-[var(--var-red-col)] text-white">
        <h2 className="text-lg sm:text-xl font-semibold">Your All Bid Data</h2>

        <input
          type="text"
          placeholder="Search Bidder or Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white text-[var(--var-red-col)] px-3 py-1 rounded text-sm outline-none w-full sm:w-auto"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-1 rounded text-sm font-semibold cursor-pointer bg-white text-[var(--var-red-col)] border hover:bg-[var(--var-red-col)] hover:text-white transition"
        >
          <option value="asc">Price Ascending</option>
          <option value="desc">Price Descending</option>
        </select>

        <button
          onClick={toggleView}
          className="px-3 py-1 bg-white text-[var(--var-red-col)] rounded shadow font-semibold hover:brightness-95 transition"
        >
          {viewMode === "table" ? "Show Chart" : "Show Table"}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center p-10 text-[var(--var-red-col)] font-semibold">
          Loading bids...
        </div>
      ) : error ? (
        <div className="text-center p-10 text-red-500 font-semibold">
          Failed to load bid data.
        </div>
      ) : filteredBids.length === 0 ? (
        <div className="text-center p-10 text-gray-500 font-medium">
          No matching results found.
        </div>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto bg-white rounded shadow-md p-1">
          <table className="min-w-full text-xs sm:text-sm text-left">
            <thead className="text-[var(--var-red-col)] border-b">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Currency</th>
                <th className="px-4 py-2">Order Price</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredBids.map((bid, index) => (
                <tr key={index} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 font-medium">{index + 1}</td>
                  <td className="px-4 py-2">{bid?.item || "NA"}</td>
                  <td className="px-4 py-2">{bid?.name || "NA"}</td>
                  <td className="px-4 py-2">{bid?.email || "NA"}</td>
                  <td className="px-4 py-2">{bid?.mobile || "NA"}</td>
                  <td className="px-4 py-2">{bid?.quantity || "NA"}</td>
                  <td className="px-4 py-2">{bid?.currency || "NA"}</td>
                  <td className="px-4 py-2">{bid?.bidAmount || "NA"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded shadow-md p-4" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredBids}
              margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="bidAmount"
                fill="var(--var-red-col)"
                name="Order Price"
                barSize={20}
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="quantity"
                fill="#8884d8"
                name="Quantity"
                barSize={20}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

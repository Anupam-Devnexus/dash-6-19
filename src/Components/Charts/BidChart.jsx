import React, { useEffect } from "react";
import useGetBid from "../../Zustand/GetApi/GetBid/GetBid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function BidChart() {
  const { BidList, fetchBid } = useGetBid();

  useEffect(() => {
    fetchBid();
  }, [fetchBid]);
  console.log(BidList)

  // Format data for chart
  const formattedData = BidList?.map((bid) => ({
    // name: `${bid.username} (${bid.email})`,
    quantity: bid.quantity,
    bidAmount: bid.bidAmount,
  })) || [];

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Bid Overview by Quantity & Order Price
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[350px] h-[300px] sm:h-[400px]">
            {formattedData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    height={90}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Bar dataKey="quantity" fill="#6366f1" name="Quantity" />
                  <Bar dataKey="bidAmount" fill="#34d399" name="Bid Amount" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300">
                No bid data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

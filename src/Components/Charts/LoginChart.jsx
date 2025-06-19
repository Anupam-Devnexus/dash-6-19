import React, { useEffect } from "react";
import GetAllUser from "../../Zustand/GetApi/GetAllUser/GetAllUser";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";

// Define color palette
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28EFF", "#FF66C4", "#FFD966", "#6AA84F",
  "#E06666", "#00B0F0"
];

export default function LoginChart() {
  const { totalusers, fetchUsers } = GetAllUser();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Group data by country
  const countryCounts = totalusers?.reduce((acc, user) => {
    const country = user?.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {}) || {};

  // Convert to array for Recharts
  const chartData = Object.entries(countryCounts).map(([country, count]) => ({
    name: country,
    value: count
  }));

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Login Users by Country
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[300px] h-[300px] sm:h-[400px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: "13px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300">No user data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

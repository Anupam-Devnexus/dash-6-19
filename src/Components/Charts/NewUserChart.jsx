import React, { useState, useMemo } from "react";
import TotalDb from '../../DataStore/TotalDb.json';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function formatDate(date) {
  // Format date as YYYY-MM-DD for grouping
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function subtractMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

export default function NewUserChart() {
  const [filter, setFilter] = useState("7days"); // options: 7days, 1month, 3months

  // Get today's date (UTC 0:00)
  const today = new Date();
  today.setHours(0,0,0,0);

  // Calculate start date based on filter
  const startDate = useMemo(() => {
    if (filter === "7days") return addDays(today, -6); // include today + 6 before
    if (filter === "1month") return subtractMonths(today, 1);
    if (filter === "3months") return subtractMonths(today, 3);
    return addDays(today, -6);
  }, [filter, today]);

  // Filter users who signed up after startDate
  const filteredUsers = useMemo(() => {
    return TotalDb.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= startDate && createdAt <= today;
    });
  }, [startDate, today]);

  // Group users by date for chart
  const chartData = useMemo(() => {
    const counts = {};
    // Create date keys between startDate and today with zero count
    for(let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)){
      counts[d.toISOString().slice(0,10)] = 0;
    }
    filteredUsers.forEach(user => {
      const date = formatDate(user.createdAt);
      if (counts[date] !== undefined) counts[date]++;
    });

    // Convert counts to array sorted by date ascending
    return Object.entries(counts).map(([date, count]) => ({
      date,
      newUsers: count
    }));
  }, [filteredUsers, startDate, today]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-center mb-4">New Users Signup</h2>

      <div className="mb-4 flex justify-center">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="3months">Last 3 Months</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} height={60} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="newUsers" fill="#82ca9d" name="New Users" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
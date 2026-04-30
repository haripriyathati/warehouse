import { useEffect, useState } from "react";
import { getUserBookings } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EcomDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    async function fetchData() {
      if (!user?._id) return;

      const bookings = await getUserBookings(user._id);

      const pending = bookings.filter(b => b.status === "pending").length;
      const accepted = bookings.filter(b => b.status === "accepted").length;
      const rejected = bookings.filter(b => b.status === "rejected").length;

      setStats({
        total: bookings.length,
        pending,
        accepted,
        rejected,
      });
    }

    fetchData();
  }, []);

  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "Accepted", value: stats.accepted },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <div>
      <h2>📊 My Dashboard</h2>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card">📦 Total: {stats.total}</div>
        <div className="card">⏳ Pending: {stats.pending}</div>
        <div className="card">✅ Accepted: {stats.accepted}</div>
        <div className="card">❌ Rejected: {stats.rejected}</div>
      </div>

      {/* Chart */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>📊 Booking Status</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { getUserBookings } from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function EcomDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    rejected: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    async function fetchData() {
      try {
        if (!user?._id) return;

        const bookings = await getUserBookings(
          user._id
        );

        const pending = bookings.filter(
          (b) => b.status === "pending"
        ).length;

        const accepted = bookings.filter(
          (b) => b.status === "accepted"
        ).length;

        const completed = bookings.filter(
          (b) => b.status === "completed"
        ).length;

        const rejected = bookings.filter(
          (b) => b.status === "rejected"
        ).length;

        setStats({
          total: bookings.length,
          pending,
          accepted,
          completed,
          rejected,
        });

        setRecentBookings(bookings.slice(0, 5));

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    }

    fetchData();
  }, [user]);

  const chartData = [
    {
      name: "Pending",
      value: stats.pending,
      fill: "#f59e0b",
    },
    {
      name: "Accepted",
      value: stats.accepted,
      fill: "#14b8a6",
    },
    {
      name: "Completed",
      value: stats.completed,
      fill: "#22c55e",
    },
    {
      name: "Rejected",
      value: stats.rejected,
      fill: "#f43f5e",
    },
  ];

  return (
    <section className="page dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>📊 E-commerce Dashboard</h2>

        <p>
          Track warehouse requests, confirmations,
          and completed storage deals
        </p>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stats-card">
          <h4>📦 Total Requests</h4>
          <h2>{stats.total}</h2>
        </div>

        <div className="stats-card">
          <h4>⏳ Pending</h4>
          <h2>{stats.pending}</h2>
        </div>

        <div className="stats-card">
          <h4>✅ Accepted</h4>
          <h2>{stats.accepted}</h2>
        </div>

        <div className="stats-card">
          <h4>✔ Completed</h4>
          <h2>{stats.completed}</h2>
        </div>

        <div className="stats-card">
          <h4>❌ Rejected</h4>
          <h2>{stats.rejected}</h2>
        </div>
      </div>

      {/* CHART */}
      <div className="card dashboard-chart-card">

        <div className="dashboard-card-header">
          <h3>📈 Booking Status Overview</h3>
        </div>

        <ResponsiveContainer
          width="100%"
          height={340}
        >
          <BarChart data={chartData}>

            <XAxis
              dataKey="name"
              tick={{
                fill: "#cbd5e1",
                fontSize: 14,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#cbd5e1",
                fontSize: 14,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                color: "white",
              }}
            />

            <Bar
              dataKey="value"
              radius={[12, 12, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.fill}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="card dashboard-activity-card">

        <div className="dashboard-card-header">
          <h3>🔔 Recent Booking Activity</h3>
        </div>

        <div className="activity-list">

          {recentBookings.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            recentBookings.map((b) => (
              <div
                key={b._id}
                className="activity-item"
              >
                <div>
                  <p className="activity-text">
                    📦 Request for{" "}
                    <strong>
                      {b.listing?.title}
                    </strong>
                  </p>
                </div>

                <span
                  className={`status-badge ${b.status}`}
                >
                  {b.status}
                </span>
              </div>
            ))
          )}

        </div>
      </div>
    </section>
  );
}
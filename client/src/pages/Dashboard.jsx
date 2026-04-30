import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import { getOwnerListings, getOwnerBookings } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    listings: 0,
    bookings: 0,
    pending: 0,
    accepted: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!user?._id) return;

        const listings = await getOwnerListings(user._id);
        const bookings = await getOwnerBookings(user._id);

        const pending = bookings.filter(
          (b) => b.status === "pending"
        ).length;

        const accepted = bookings.filter(
          (b) => b.status === "accepted"
        ).length;

        setStats({
          listings: listings.length,
          bookings: bookings.length,
          pending,
          accepted,
        });

        // latest 5 bookings
        setRecentBookings(bookings.slice(0, 5));
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    }

    fetchData();
  }, [user]);

  return (
    <section className="page active">
      
      {/* 📊 STATS */}
      <div className="stats-grid">
        <StatsCard label="📦 My Listings" value={stats.listings} />
        <StatsCard label="📑 Total Bookings" value={stats.bookings} type="info" />
        <StatsCard label="⏳ Pending Requests" value={stats.pending} type="warning" />
        <StatsCard label="✅ Accepted Bookings" value={stats.accepted} type="success" />
      </div>

      {/* 🔔 RECENT ACTIVITY */}
      <div className="card">
        <div className="card-header">
          <h3>🔔 Recent Activity</h3>
        </div>

        <div className="card-body">
          {recentBookings.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            recentBookings.map((b) => (
              <p key={b._id}>
                📦 {b.user?.name || "User"} requested{" "}
                <strong>{b.listing?.title}</strong> —{" "}
                <span style={{ color: "#888" }}>{b.status}</span>
              </p>
            ))
          )}
        </div>
      </div>

    </section>
  );
}
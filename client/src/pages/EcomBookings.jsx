import { useEffect, useState } from "react";
import { getUserBookings } from "../services/api";

export default function EcomBookings() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (user?._id) {
      getUserBookings(user._id).then(setBookings);
    }
  }, []);

  return (
    <div>
      <h2>📦 My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="card">
            <h3>{b.listing?.title}</h3>
            <p>💰 Price: ₹{b.listing?.price}</p>
            <p>Status: {b.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
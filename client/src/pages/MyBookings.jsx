import { useEffect, useState } from "react";
import { getOwnerBookings, updateBooking } from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (user?._id) {
      getOwnerBookings(user._id).then(setBookings);
    }
  }, [user]);

  const handleUpdate = async (id, status) => {
    await updateBooking(id, status);
    const updated = await getOwnerBookings(user._id);
    setBookings(updated);
  };

  return (
    <div>
      <h2>📥 Booking Requests</h2>

      {bookings.length === 0 && <p>No booking requests yet</p>}

      {bookings.map((b) => (
        <div key={b._id} className="card">
          <h3>{b.listing.title}</h3>
          <p>Requested by: {b.user.name}</p>

          <p>From: {new Date(b.startDate).toLocaleDateString()}</p>
          <p>To: {new Date(b.endDate).toLocaleDateString()}</p>
          <p>Total: ₹{b.totalPrice}</p>

          <p>Status: {b.status}</p>

          {b.status === "pending" && (
            <>
              <button onClick={() => handleUpdate(b._id, "accepted")}>
                ✅ Accept
              </button>

              <button onClick={() => handleUpdate(b._id, "rejected")}>
                ❌ Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
import { useEffect, useState } from "react";
import { getUserBookings, confirmBooking } from "../services/api";
import jsPDF from "jspdf";

export default function EcomBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [hasViewedAgreement, setHasViewedAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (user?._id) {
      const data = await getUserBookings(user._id);
      setBookings(data);
    }
  };

  const handleConfirm = async (id) => {
    await confirmBooking(id);
    setSelectedBooking(null);
    fetchData(); // 🔥 refresh list
  };


  const generatePDF = (booking) => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Warehouse Rental Agreement", 20, 20);
    
    doc.setFontSize(12);

    doc.text(`Agreement ID: ${booking._id}`, 20, 70);
    doc.text(`Generated on: ${new Date().toDateString()}`, 20, 160);
    doc.text(`Kirana Owner: ${booking.listing.owner}`, 20, 120);
    doc.text(`Ecom User: ${user.name}`, 20, 130);

    doc.text(`Warehouse: ${booking.listing.title}`, 20, 40);
    doc.text(`Price: ₹${booking.listing.price}`, 20, 50);
    
    doc.text(
      `Duration: ${new Date(booking.startDate).toDateString()} - ${new Date(
        booking.endDate
      ).toDateString()}`,
      20,
      60
    );
  
    doc.text("Terms:", 20, 80);
    doc.text("- No illegal goods", 20, 90);
    doc.text("- Maintain storage conditions", 20, 100);
    doc.text("- No cancellation after confirmation", 20, 110);
  
    doc.text("Signature:", 20, 140);
    doc.text("__________________________", 20, 150);
  
    doc.save("agreement.pdf");
  };

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

            {/* ✅ ACCEPTED MESSAGE */}
            {b.status === "accepted" && (
              <>
                <p style={{ color: "green" }}>
                  ✅ Your request was accepted!
                </p>

                <button
                  onClick={() => {
                    setSelectedBooking(b);
                    setHasViewedAgreement(true); // 🔥 mark viewed
                  }}
                >
                  📄 View Agreement
                </button>
                <p style={{ color: "red" }}>
                  ⚠️ You must review and accept this agreement before confirming.
                </p>
              </>
            )}

            {/* 📄 AGREEMENT (only for selected booking) */}
            {selectedBooking?._id === b._id && (
              <div className="card" style={{ marginTop: "10px" }}>
                <h3>📄 Agreement</h3>

                <p>Warehouse: {b.listing.title}</p>
                <p>Price: ₹{b.listing.price}</p>
                <p>
                  Duration: {new Date(b.startDate).toDateString()} -{" "}
                  {new Date(b.endDate).toDateString()}
                </p>

                <p><strong>Terms:</strong></p>
                <ul>
                  <li>No illegal goods</li>
                  <li>Maintain storage conditions</li>
                  <li>No cancellation after confirmation</li>
                </ul>
                <button onClick={() => generatePDF(b)}>
                  📄 Download Agreement
                </button>

                

                <ul style={{ color: "red" }}>
                  <li>You must carry this agreement to the warehouse</li>
                  <li>This acts as a legal contract between both parties</li>
                  <li>Goods transfer allowed only after agreement</li>
                </ul>

                <label>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                  />
                  I have read and agree to the terms
                </label>

                <button
                  disabled={!hasViewedAgreement || !agreed}
                  onClick={() => handleConfirm(b._id)}
                >
                  ✅ Confirm Booking
                </button>
                                
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
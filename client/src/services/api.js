const BASE_URL = "http://localhost:5000/api";

// ✅ GET all listings
export const getListings = async () => {
  const res = await fetch(`${BASE_URL}/listings`);
  return res.json();
};

// ✅ CREATE listing (FIXED ENDPOINT)
export const createListing = async (data) => {
  const res = await fetch(`${BASE_URL}/listings/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
export const searchListings = async ({ minPrice, maxPrice, minCapacity, lat, lng }) => {
  const query = new URLSearchParams({
    minPrice,
    maxPrice,
    minCapacity,
    lat,
    lng,
  });

  const res = await fetch(
    `http://localhost:5000/api/listings/search?${query}`
  );

  return res.json();
};


export const createBooking = async (
  listing,
  user,
  startDate,
  endDate
) => {
  const res = await fetch("http://localhost:5000/api/bookings/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listing,
      user,
      startDate,
      endDate,
    }),
  });

  return res.json();
};

export const getOwnerListings = async (ownerId) => {
  const res = await fetch(`http://localhost:5000/api/listings?owner=${ownerId}`);
  return res.json();
};

export const getOwnerBookings = async (ownerId) => {
  const res = await fetch(`http://localhost:5000/api/bookings/owner/${ownerId}`);
  return res.json();
};

export const deleteListing = async (id) => {
  const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
    method: "DELETE",
  });
  return res.json();
};


export const updateListing = async (id, data) => {
  const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateBooking = async (id, status) => {
  const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const getUserBookings = async (userId) => {
  const res = await fetch(
    `http://localhost:5000/api/bookings/user/${userId}`
  );
  return res.json();
};

export const confirmBooking = async (id) => {
  const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "confirmed",
      agreementAccepted: true,
    }),
  });
  return res.json();
};

export const markPaid = async (id) => {
  const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentStatus: "paid",
      status: "completed",
    }),
  });
  return res.json();
};
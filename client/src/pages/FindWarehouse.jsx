import { useState, useEffect } from "react";

import {
  searchListings,
  createBooking,
  getUserBookings,
  getListingReviews,
} from "../services/api";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

// 📏 Distance calculator
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLng =
    ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

export default function FindWarehouse() {
  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [minCapacity, setMinCapacity] =
    useState("");

  const [radius, setRadius] =
    useState(50);

  const [ratings, setRatings] =
    useState({});

  const [demandData, setDemandData] =
    useState({});

  const [results, setResults] =
    useState([]);

  const [userLocation, setUserLocation] =
    useState(null);

  const [userBookings, setUserBookings] =
    useState([]);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // 🔁 Fetch user bookings
  useEffect(() => {
    async function fetchBookings() {
      if (user?._id) {
        const data =
          await getUserBookings(user._id);

        setUserBookings(data);
      }
    }

    fetchBookings();
  }, []);

  // 🔍 Find booking for listing
  const getBookingForListing = (
    listingId
  ) => {
    return userBookings.find(
      (b) => b.listing?._id === listingId
    );
  };

  // 🔍 SEARCH
  const handleSearch = async () => {
    try {
      const data =
        await searchListings({
          minPrice: minPrice
            ? Number(minPrice)
            : undefined,

          maxPrice: maxPrice
            ? Number(maxPrice)
            : undefined,

          minCapacity: minCapacity
            ? Number(minCapacity)
            : undefined,

          lat: userLocation?.lat,
          lng: userLocation?.lng,
        });

      // ⭐ RATINGS + DEMAND
      const ratingsData = {};
      const demandInfo = {};

      for (const listing of data) {
        const reviews =
          await getListingReviews(
            listing._id
          );

        const avg =
          reviews.length > 0
            ? (
                reviews.reduce(
                  (sum, r) =>
                    sum + r.rating,
                  0
                ) / reviews.length
              ).toFixed(1)
            : 0;

        ratingsData[listing._id] = {
          average: avg,
          count: reviews.length,
        };

        // 🤖 AI SCORE
        const demandScore =
          Number(avg) * 2 +
          reviews.length;

        demandInfo[listing._id] =
          demandScore;
      }

      setRatings(ratingsData);
      setDemandData(demandInfo);

      setResults(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(err);

      setResults([]);
    }
  };

  // 📍 GET LOCATION
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () =>
        alert(
          "Location access denied"
        )
    );
  };

  // 🧠 PROCESS RESULTS
  const processedResults = results
    .map((item) => {
      const distance = userLocation
        ? getDistance(
            userLocation.lat,
            userLocation.lng,
            item.location.lat,
            item.location.lng
          )
        : null;

      return {
        ...item,
        distance,
      };
    })

    .filter(
      (item) =>
        item.distance !== null &&
        item.distance <= radius
    )

    // 🤖 SORT BY AI SCORE
    .sort(
      (a, b) =>
        (demandData[b._id] || 0) -
        (demandData[a._id] || 0)
    );

  return (
    <section className="page find-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>
          🔍 Smart Warehouse Finder
        </h2>

        <p>
          AI-powered warehouse
          recommendations based on
          ratings and demand
        </p>
      </div>

      {/* FILTERS */}
      <div className="card filter-card">

        <div className="filter-row">

          <input
            placeholder="Radius (km)"
            value={radius}
            onChange={(e) =>
              setRadius(
                Number(e.target.value)
              )
            }
          />

          <input
            placeholder="Min Price"
            onChange={(e) =>
              setMinPrice(
                e.target.value
              )
            }
          />

          <input
            placeholder="Max Price"
            onChange={(e) =>
              setMaxPrice(
                e.target.value
              )
            }
          />

          <input
            placeholder="Min Capacity"
            onChange={(e) =>
              setMinCapacity(
                e.target.value
              )
            }
          />
        </div>

        <div className="filter-actions">

          <button
            onClick={getLocation}
          >
            📍 Use My Location
          </button>

          <button
            onClick={handleSearch}
            disabled={!userLocation}
          >
            🔍 Search Warehouses
          </button>

        </div>
      </div>

      {/* EMPTY STATES */}
      {results.length === 0 ? (
        <p className="empty-state">
          No results found
        </p>
      ) : processedResults.length === 0 ? (
        <p className="empty-state">
          No warehouses within radius
        </p>
      ) : null}

      {/* LISTINGS */}
      <div className="results-grid">

        {processedResults.map(
          (item, index) => {
            const booking =
              getBookingForListing(
                item._id
              );

            return (
              <div
                key={item._id}
                className="card warehouse-card"
              >

                {/* 🤖 BEST MATCH */}
                {index === 0 && (
                  <div className="best-match">
                    🤖 AI Recommended
                  </div>
                )}

                {/* 🔥 HIGH DEMAND */}
                {index < 2 && (
                  <div className="demand-badge">
                    🔥 High Demand
                  </div>
                )}

                {/* IMAGE */}
                {item.images?.[0] && (
                  <img
                    src={item.images[0]}
                    alt="warehouse"
                    className="warehouse-image"
                  />
                )}

                {/* CONTENT */}
                <div className="warehouse-content">

                  <h3>
                    {item.title}
                  </h3>

                  {/* ⭐ RATINGS */}
                  <div className="listing-rating">
                    {ratings[item._id]
                      ?.average ? (
                      <>
                        ⭐{" "}
                        {
                          ratings[
                            item._id
                          ].average
                        }

                        <span>
                          {" "}
                          (
                          {
                            ratings[
                              item._id
                            ].count
                          }{" "}
                          reviews)
                        </span>
                      </>
                    ) : (
                      "No reviews yet"
                    )}
                  </div>

                  <p>
                    💰 ₹{item.price}
                  </p>

                  <p>
                    📦 Capacity:{" "}
                    {item.capacity}
                  </p>

                  <p>
                    📍{" "}
                    {item.distance.toFixed(
                      2
                    )}{" "}
                    km away
                  </p>

                  {/* STATUS BUTTONS */}

                  {!booking && (
                    <button
                      className="booking-btn"
                      onClick={async () => {
                        await createBooking(
                          item._id,
                          user._id,
                          "2026-04-25",
                          "2026-04-28"
                        );

                        const updated =
                          await getUserBookings(
                            user._id
                          );

                        setUserBookings(
                          updated
                        );

                        alert(
                          "Request sent!"
                        );
                      }}
                    >
                      📦 Request Booking
                    </button>
                  )}

                  {booking?.status ===
                    "pending" && (
                    <button
                      disabled
                      className="pending-btn"
                    >
                      ⏳ Pending
                    </button>
                  )}

                  {booking?.status ===
                    "accepted" && (
                    <button
                      disabled
                      className="accepted-btn"
                    >
                      ✅ Accepted
                    </button>
                  )}

                  {booking?.status ===
                    "confirmed" && (
                    <button
                      disabled
                      className="confirmed-btn"
                    >
                      📦 In Use
                    </button>
                  )}

                  {booking?.status === "completed" && (
                    <button
                      className="booking-btn"
                      onClick={async () => {
                        await createBooking(
                          item._id,
                          user._id,
                          "2026-04-25",
                          "2026-04-28"
                        );
                      
                        const updated =
                          await getUserBookings(
                            user._id
                          );
                        
                        setUserBookings(updated);
                        
                        alert("New request sent!");
                      }}
                    >
                      🔁 Book Again
                    </button>
                  )}

                  {booking?.status ===
                    "rejected" && (
                    <button
                      className="rejected-btn"
                      onClick={async () => {
                        await createBooking(
                          item._id,
                          user._id,
                          "2026-04-25",
                          "2026-04-28"
                        );

                        const updated =
                          await getUserBookings(
                            user._id
                          );

                        setUserBookings(
                          updated
                        );
                      }}
                    >
                      🔁 Retry Booking
                    </button>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* 🗺️ MAP */}
      {userLocation && (
        <div className="map-container">

          <MapContainer
            center={[
              userLocation.lat,
              userLocation.lng,
            ]}
            zoom={13}
            style={{
              height: "450px",
              width: "100%",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* 👤 USER */}
            <Marker
              position={[
                userLocation.lat,
                userLocation.lng,
              ]}
            >
              <Popup>
                You are here
              </Popup>
            </Marker>

            {/* 📍 LISTINGS */}
            {processedResults.map(
              (item) => (
                <Marker
                  key={item._id}
                  position={[
                    item.location.lat,
                    item.location.lng,
                  ]}
                >
                  <Popup>
                    <strong>
                      {item.title}
                    </strong>

                    <br />

                    ⭐{" "}
                    {
                      ratings[item._id]
                        ?.average
                    }

                    <br />

                    ₹{item.price}

                    <br />

                    📍{" "}
                    {item.distance.toFixed(
                      2
                    )}{" "}
                    km
                  </Popup>
                </Marker>
              )
            )}
          </MapContainer>
        </div>
      )}
    </section>
  );
}
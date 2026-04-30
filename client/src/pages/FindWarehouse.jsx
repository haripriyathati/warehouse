import { useState } from "react";
import { searchListings, createBooking } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// 📏 Distance calculator
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function FindWarehouse() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [radius, setRadius] = useState(50);

  const [results, setResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔍 SEARCH
  const handleSearch = async () => {
  try {
    const data = await searchListings({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minCapacity: minCapacity ? Number(minCapacity) : undefined,
      lat: userLocation?.lat,
      lng: userLocation?.lng,
    });

    // ✅ Ensure array
    if (Array.isArray(data)) {
      setResults(data);
    } else {
      console.error("API ERROR:", data);
      setResults([]);
    }
  } catch (err) {
    console.error("FETCH ERROR:", err);
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
      () => alert("Location access denied")
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

      return { ...item, distance };
    })
    .filter((item) => item.distance !== null && item.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  return (
    <div>
      <section className="page active">
        <h2>🔍 Find Warehouse</h2>

        <button onClick={getLocation}>📍 Use My Location</button>

        {/* 🔧 FILTERS */}
        <input
          placeholder="Radius (km)"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />

        <input
          placeholder="Min Price"
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          placeholder="Max Price"
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input
          placeholder="Min Capacity"
          onChange={(e) => setMinCapacity(e.target.value)}
        />

        <button onClick={handleSearch} disabled={!userLocation}>
          Search
        </button>

        <hr />

        {/* 📢 STATUS */}
        {results.length === 0 ? (
          <p>No results found</p>
        ) : processedResults.length === 0 ? (
          <p>No warehouses within radius</p>
        ) : null}

        {/* 📦 LISTINGS */}
        {processedResults.map((item, index) => (
          <div key={item._id} className="card">

            {index === 0 && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                ⭐ Best Match
              </p>
            )}

            <h3>{item.title}</h3>
            <p>₹{item.price}</p>
            <p>Capacity: {item.capacity}</p>
            <p>📍 {item.distance.toFixed(2)} km away</p>

            {/* 📦 BOOKING */}
            {user && (
              <button
                onClick={async () => {
                  const res = await createBooking(
                    item._id,
                    user._id,
                    "2026-04-25",
                    "2026-04-28"
                  );
                  console.log("BOOKING RESPONSE:", res);
                }}
              >
                📦 Request Booking
              </button>
            )}
            <br></br>``
            <img
              src={item.images?.[0]}
              alt="warehouse"
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
          </div>
        ))}
      </section>

      {/* 🗺️ MAP */}
      {userLocation && (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={13}
          style={{ height: "400px", marginTop: "20px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 👤 USER */}
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>

          {/* 📍 LISTINGS */}
          {processedResults.map((item) => (
            <Marker
              key={item._id}
              position={[item.location.lat, item.location.lng]}
            >
              <Popup>
                {item.title} <br />
                ₹{item.price} <br />
                📍 {item.distance.toFixed(2)} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
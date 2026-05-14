import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

import {
  getListings,
  getListingReviews,
} from "../services/api";

export default function Map() {
  const [listings, setListings] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getListings();

        setListings(data);

        const ratingsData = {};

        for (const listing of data) {
          const reviews = await getListingReviews(
            listing._id
          );

          const avg =
            reviews.length > 0
              ? (
                  reviews.reduce(
                    (sum, r) => sum + r.rating,
                    0
                  ) / reviews.length
                ).toFixed(1)
              : 0;

          ratingsData[listing._id] = {
            average: avg,
            count: reviews.length,
          };
        }

        setRatings(ratingsData);

      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  // 🤖 AI SCORE
  const getAIScore = (listingId) => {
    const rating = Number(
      ratings[listingId]?.average || 0
    );

    const reviewCount =
      ratings[listingId]?.count || 0;

    return rating * 5 + reviewCount * 2;
  };

  return (
    <section className="page map-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>🗺️ Smart Demand Map</h2>

        <p>
          Explore AI-recommended warehouse
          regions based on ratings and demand
        </p>
      </div>

      {/* MAP CARD */}
      <div className="card map-card">

        <MapContainer
          center={[17.385, 78.4867]}
          zoom={5}
          style={{
            height: "650px",
            width: "100%",
            borderRadius: "24px",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {listings.map((item) => {
            const score = getAIScore(item._id);

            let color = "#22c55e";

            if (score > 20) {
              color = "#ef4444";
            } else if (score > 10) {
              color = "#f59e0b";
            }

            return (
              <>
                {/* DEMAND REGION */}
                <Circle
                  center={[
                    item.location.lat,
                    item.location.lng,
                  ]}
                  radius={25000}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.25,
                  }}
                />

                {/* MARKER */}
                <Marker
                  key={item._id}
                  position={[
                    item.location.lat,
                    item.location.lng,
                  ]}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>{item.title}</h3>

                      <p>
                        ⭐ {
                          ratings[item._id]
                            ?.average || "0"
                        }
                      </p>

                      <p>
                        📝 {
                          ratings[item._id]
                            ?.count || 0
                        } reviews
                      </p>

                      <p>
                        💰 ₹{item.price}
                      </p>

                      <p>
                        📦 Capacity: {item.capacity}
                      </p>

                      {score > 20 && (
                        <p>
                          🔥 Very High Demand
                        </p>
                      )}

                      {score > 10 && score <= 20 && (
                        <p>
                          ⭐ Recommended Region
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </>
            );
          })}
        </MapContainer>
      </div>

      {/* LEGEND */}
      <div className="map-legend">

        <div className="legend-item">
          <span className="legend-dot green"></span>
          Low Demand
        </div>

        <div className="legend-item">
          <span className="legend-dot yellow"></span>
          Recommended
        </div>

        <div className="legend-item">
          <span className="legend-dot red"></span>
          High Demand
        </div>

      </div>
    </section>
  );
}
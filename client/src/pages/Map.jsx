export default function Map() {
  return (
    <section className="page active">
      <div className="card">
        <div className="card-header">
          <h3>🗺️ Geo Network Map</h3>
        </div>

        <div className="card-body">
          <div className="map-container">
            <div className="map-grid"></div>

            <div className="map-node" style={{ left: "30%", top: "40%" }}></div>
            <div className="map-node ecom" style={{ left: "50%", top: "60%" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
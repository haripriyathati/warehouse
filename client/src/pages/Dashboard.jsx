import StatsCard from "../components/StatsCard";

export default function Dashboard() {
  return (
    <section className="page active">
      <div className="stats-grid">
        <StatsCard label="Active Warehouses" value="142" />
        <StatsCard label="E-comm Partners" value="38" type="info" />
        <StatsCard label="Orders Fulfilled" value="2,847" type="warning" />
        <StatsCard label="Avg Delivery Time" value="1.8h" type="danger" />
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🔔 Live Activity</h3>
        </div>

        <div className="card-body">
          <p>Ramesh Kirana matched with Zepto</p>
          <p>New listing in Nagpur</p>
          <p>Temperature alert triggered</p>
        </div>
      </div>
    </section>
  );
}
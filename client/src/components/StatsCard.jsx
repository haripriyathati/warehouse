export default function StatsCard({ label, value, type }) {
  return (
    <div className={`stat-card ${type || ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
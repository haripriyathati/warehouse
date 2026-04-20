export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-title">MicroWarehouse Dashboard</div>

      <div className="topbar-actions">
        <button className="btn btn-ghost">⟳ Sync</button>
        <button className="btn btn-primary">+ List Space</button>
      </div>
    </div>
  );
}
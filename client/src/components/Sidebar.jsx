import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">MicroWH</div>

      <nav>
        <Link to="/find">🔍 Find Warehouse</Link>
        <Link to="/bookings">📥 Bookings</Link>
        <Link className="nav-link" to="/">📊 Dashboard</Link>
        <Link className="nav-link" to="/map">🗺️ Geo Map</Link>
        <Link className="nav-link" to="/my-spaces">📦 My Spaces</Link>
        <Link to="/list-space">➕ List Space</Link>
      </nav>
    </aside>
  );
}
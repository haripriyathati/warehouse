import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">🏬</div>
        <div>
          <span className="logo-text">MicroWH</span>
          <span className="logo-sub">Shared Platform</span>
        </div>
      </div>

      <nav>
        <div className="nav-section">Overview</div>

        <Link className={`nav-link ${pathname === "/" ? "active" : ""}`} to="/">
          📊 Dashboard
        </Link>

        <Link className={`nav-link ${pathname === "/map" ? "active" : ""}`} to="/map">
          🗺️ Geo Map
        </Link>
      </nav>
    </aside>
  );
}
import { Link } from "react-router-dom";

export default function Sidebar({ user }){

  return (
    <aside className="sidebar">
      <h2>MicroWH</h2>

      {user?.role === "kirana" && (
        <>
          <Link to="/">📊 Dashboard</Link>
          <Link to="/my-spaces">📦 My Spaces</Link>
          <Link to="/list-space">➕ List Space</Link>
          <Link to="/bookings">📥 Bookings</Link>
        </>
      )}

      {user?.role === "ecom" && (
        <>
          <Link to="/">📊 Dashboard</Link>
          <Link to="/find">🔍 Find Warehouse</Link>
          <Link to="/map">🗺️ Map</Link>
          <Link to="/my-bookings">📑 My Bookings</Link>
        </>
      )}
    </aside>
  );
}
import { useNavigate } from "react-router-dom";

export default function Topbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null); // 🔥 instant UI update
    navigate("/login");
  };

  return (
    <div className="topbar">
      <h3>MicroWarehouse Dashboard</h3>

      <div>
        <span style={{ marginRight: "10px" }}>
          👤 {user?.name || user?.email} ({user?.role})
        </span>

        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
}
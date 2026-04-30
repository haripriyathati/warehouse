import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import FindWarehouse from "./pages/FindWarehouse";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import MySpaces from "./pages/MySpaces";
import MyBookings from "./pages/MyBookings";
import ListSpace from "./pages/ListSpace";
import Login from "./pages/Login";
import EcomBookings from "./pages/EcomBookings";
import EcomDashboard from "./pages/EcomDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Single clean sync
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      {user && <Sidebar user={user} />}

      <main className="main">
        {user && <Topbar user={user} setUser={setUser} />}

        <Routes>
          {/* LOGIN */}
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* ROLE BASED DASHBOARD */}
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                {user?.role === "kirana" ? (
                  <Dashboard />
                ) : (
                  <EcomDashboard />
                )}
              </ProtectedRoute>
            }
          />

          {/* KIRANA */}
          <Route
            path="/my-spaces"
            element={
              <ProtectedRoute user={user} allowedRoles={["kirana"]}>
                <MySpaces />
              </ProtectedRoute>
            }
          />

          <Route
            path="/list-space"
            element={
              <ProtectedRoute user={user} allowedRoles={["kirana"]}>
                <ListSpace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute user={user} allowedRoles={["kirana"]}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* ECOM */}
          <Route
            path="/find"
            element={
              <ProtectedRoute user={user} allowedRoles={["ecom"]}>
                <FindWarehouse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/map"
            element={
              <ProtectedRoute user={user} allowedRoles={["ecom"]}>
                <Map />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute user={user} allowedRoles={["ecom"]}>
                <EcomBookings />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              user ? (
                <Navigate to={user.role === "kirana" ? "/" : "/"} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FindWarehouse from "./pages/FindWarehouse";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import MySpaces from "./pages/MySpaces";
import MyBookings from "./pages/MyBookings"
import ListSpace from "./pages/ListSpace";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <main className="main">
        <Topbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
          <Route path="/my-spaces" element={<MySpaces />} />
          <Route path="/find" element={<FindWarehouse />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/list-space" element={<ListSpace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
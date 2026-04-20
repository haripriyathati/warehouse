import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <main className="main">
        <Topbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
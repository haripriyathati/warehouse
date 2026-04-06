import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import CreateListing from "./pages/CreateListing";

function App() {
  return (
    <div>
      <h1>Micro Warehouse Platform</h1>

      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/listings">Listings</Link> |{" "}
        <Link to="/create">Create Listing</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/create" element={<CreateListing />} />
      </Routes>
    </div>
  );
}

export default App;
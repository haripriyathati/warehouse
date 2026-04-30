import { useEffect, useState } from "react";
import {
  getOwnerListings,
  deleteListing,
  updateListing,
} from "../services/api";

export default function MySpaces() {
  const [listings, setListings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!user?._id) return;

    const data = await getOwnerListings(user._id);
    setListings(data);
  };

  const handleDelete = async (id) => {
    await deleteListing(id);
    setListings((prev) => prev.filter((item) => item._id !== id));
  };

  const handleEditSave = async (id) => {
    await updateListing(id, editForm);
    setEditing(null);
    fetchData();
  };

  return (
    <section className="page active">
      <h2>📦 My Listings</h2>

      {listings.length === 0 ? (
        <p>No listings yet</p>
      ) : (
        listings.map((item) => (
          <div key={item._id} className="card">

            {/* 🖼️ IMAGE */}
            <img
              src={item.images?.[0] || "https://via.placeholder.com/300"}
              alt="warehouse"
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />

            <div className="card-body">

              {/* ✏️ EDIT MODE */}
              {editing === item._id ? (
                <>
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    placeholder="Title"
                  />

                  <input
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    placeholder="Price"
                  />

                  <input
                    value={editForm.capacity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, capacity: e.target.value })
                    }
                    placeholder="Capacity"
                  />

                  <button onClick={() => handleEditSave(item._id)}>
                    💾 Save
                  </button>

                  <button onClick={() => setEditing(null)}>
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3>{item.title}</h3>
                  <p>💰 Price: ₹{item.price}</p>
                  <p>📦 Capacity: {item.capacity}</p>
                  <p>
                    📍 Location: {item.location?.lat},{" "}
                    {item.location?.lng}
                  </p>

                  {/* ACTIONS */}
                  <button
                    onClick={() => {
                      setEditing(item._id);
                      setEditForm(item);
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button onClick={() => handleDelete(item._id)}>
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
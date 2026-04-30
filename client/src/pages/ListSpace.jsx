import { useState } from "react";
import axios from "axios";

export default function ListSpace() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    title: "",
    price: "",
    capacity: "",
    description: "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  

  // 📍 Get Location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
      },
      () => alert("Location access denied")
    );
  };

  // 🖼️ Upload Image
  const handleImageUpload = async (file) => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "preset0");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dklfvmuyw/image/upload",
        formData
      );

      setImageUrl(res.data.secure_url);
      console.log("Uploaded:", res.data.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    }

    setLoading(false);
  };

  // 🏪 Submit Listing
  const handleSubmit = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!form.location) {
      alert("Please set location");
      return;
    }

    if (!imageUrl) {
      alert("Please upload image first");
      return;
    }

    if(!form.title || !form.price || !form.capacity){
      alert("Please fill all required fields");
      return;
    }

    console.log("SUBMIT IMAGE URL:", imageUrl);
    console.log("FINAL PAYLOAD:", {
      ...form,
      images: imageUrl ? [imageUrl] : [],
    });
    try {
      const res = await fetch(
        "http://localhost:5000/api/listings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            capacity: Number(form.capacity),
            owner: user._id,
            location: form.location,
            images: imageUrl ? [imageUrl] : [],
          }),
        }
      );

      const data = await res.json();
      console.log("LISTING CREATED:", data);

      alert("Listing created successfully!");

      // reset form
      setForm({
        title: "",
        price: "",
        capacity: "",
        description: "",
        location: null,
      });
      setImageUrl("");

    } catch (err) {
      console.error(err);
      alert("Error creating listing");
    }
  };

  return (
    <div>
      <h2>🏪 List Your Warehouse</h2>

      {/* 📄 Inputs */}
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <input
        placeholder="Capacity"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      {/* 📍 Location */}
      <button onClick={getLocation}>📍 Use My Location</button>

      {form.location && (
        <p style={{ color: "green" }}>
          📍 Location added
        </p>
      )}

      {/* 🖼️ Image Upload */}
      <input
        type="file"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />

      {imageUrl && (
        <p style={{ color: "green" }}>✅ Image uploaded</p>
      )}

      {loading && <p>Uploading image...</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="preview"
          style={{ width: "200px", marginTop: "10px" }}
        />
      )}

      {/* 🚀 Submit */}
      <button onClick={handleSubmit} disabled={loading || !imageUrl}>
        {loading ? "Uploading..." : "Create Listing"}
      </button>
    </div>
  );
}
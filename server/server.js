const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");


const app = express();

// middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

// DB connection

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});
//test 
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
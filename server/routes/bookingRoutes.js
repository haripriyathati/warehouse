const express = require("express");
const router = express.Router();
const Booking = require("../models/Bookings");
const Listing = require("../models/Listing");

// CREATE BOOKING
router.post("/create", async (req, res) => {
  try {
    const { listing, user, startDate, endDate } = req.body;

    const listingData = await Listing.findById(listing);

    if (!listingData) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // calculate total price
    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

    if (days <= 0) {
        return res.status(400).json({ message: "Invalid date range" });
    }

    const totalPrice = days * listingData.price;

    const booking = new Booking({
      listing,
      user,
      startDate,
      endDate,
      totalPrice,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL BOOKINGS
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("listing", "title price");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
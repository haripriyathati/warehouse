const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

// CREATE LISTING
router.post("/create", async (req, res) => {
  try {
    const { owner, title, location, capacity, price, description } = req.body;

    const listing = new Listing({
      owner,
      title,
      location,
      capacity,
      price,
      description,
    });

    await listing.save();

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL LISTINGS
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().populate("owner", "name email");
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { minPrice, maxPrice, minCapacity, lat, lng } = req.query;

    let query = {};

    // price filter
    if (minPrice && maxPrice) {
      query.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    // capacity filter
    if (minCapacity) {
      query.capacity = { $gte: Number(minCapacity) };
    }

    let listings = await Listing.find(query);

    // optional: sort by distance (basic)
    if (lat && lng) {
      listings = listings.sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.location.lat - lat, 2) +
          Math.pow(a.location.lng - lng, 2)
        );

        const distB = Math.sqrt(
          Math.pow(b.location.lat - lat, 2) +
          Math.pow(b.location.lng - lng, 2)
        );

        return distA - distB;
      });
    }

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
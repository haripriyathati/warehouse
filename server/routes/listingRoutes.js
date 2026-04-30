const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

// CREATE LISTING
router.post("/create", async (req, res) => {
  try {
    const { owner, title, location, capacity, price, description, images} = req.body;

    const listing = new Listing({
      owner,
      title,
      location,
      capacity,
      price,
      description,
      images,
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
    let query = {};

    // ✅ filter by owner if provided
    if (req.query.owner) {
      query.owner = req.query.owner;
    }

    const listings = await Listing.find(query);

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

// DELETE LISTING
router.delete("/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// UPDATE LISTING
router.put("/:id", async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
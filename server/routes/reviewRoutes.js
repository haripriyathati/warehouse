const express = require("express");
const router = express.Router();

const Review = require("../models/Review");

// ⭐ CREATE REVIEW
router.post("/create", async (req, res) => {
  try {
    const { booking, listing, user, rating, comment } = req.body;

    // prevent duplicate review
    const existing = await Review.findOne({ booking });

    if (existing) {
      return res.status(400).json({
        message: "Review already submitted",
      });
    }

    const review = new Review({
      booking,
      listing,
      user,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ⭐ GET REVIEWS FOR LISTING
router.get("/listing/:listingId", async (req, res) => {
  try {
    const reviews = await Review.find({
      listing: req.params.listingId,
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
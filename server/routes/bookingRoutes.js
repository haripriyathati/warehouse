const express = require("express");
const router = express.Router();
const Booking = require("../models/Bookings");
const Listing = require("../models/Listing");
const Transaction =require("../models/Transaction")

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
      Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

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


router.get("/owner/:ownerId", async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.params.ownerId });

    const listingIds = listings.map((l) => l._id);

    const bookings = await Booking.find({
      listing: { $in: listingIds },
    })
      .populate("user", "name email")
      .populate("listing", "title");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // ✅ update booking fields
    booking.status = req.body.status;

    if (req.body.agreementAccepted !== undefined) {
      booking.agreementAccepted = req.body.agreementAccepted;
    }

    await booking.save();

    // 💰 CREATE TRANSACTION ON CONFIRM
    if (booking.status === "confirmed") {
      const existingTx = await Transaction.findOne({
        booking: booking._id,
      });

      // avoid duplicate transaction creation
      if (!existingTx) {
        await Transaction.create({
          booking: booking._id,
          amount: booking.totalPrice,
          status: "pending",
        });
      }
    }

    res.json(booking);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// GET BOOKINGS FOR ECOM USER
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate({
        path: "listing",
        populate: {
          path: "owner",
          select: "name phone",
        },
      })
      .populate("user", "name");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 💳 MARK BOOKING AS PAID
router.put("/:id/pay", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // ✅ update booking
    booking.status = "completed";

    await booking.save();

    // ✅ update transaction
    const tx = await Transaction.findOne({
      booking: booking._id,
    });

    if (tx) {
      tx.status = "paid";
      await tx.save();
    }

    res.json({
      message: "Payment completed",
      booking,
      transaction: tx,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
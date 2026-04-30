const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    address: String,
    lat: Number,
    lng: Number,
  },
  capacity: {
    type: Number, // in kg or units
    required: true,
  },
  price: {
    type: Number, // per day
    required: true,
  },
  description: String,
  availability: {
    type: Boolean,
    default: true,
  },
  images: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);
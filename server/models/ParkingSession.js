const mongoose = require("mongoose");

const ParkingSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingArea",
  },
  parkingArea: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingArea" },
  startTime: Date,
  endTime: Date,
  price: Number,
});

module.exports = mongoose.model("ParkingSession", ParkingSessionSchema);

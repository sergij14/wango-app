const mongoose = require("mongoose");

const ParkingAreaSchema = new mongoose.Schema({
  name: String,
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
});

module.exports = mongoose.model("ParkingArea", ParkingAreaSchema);

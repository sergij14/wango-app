const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  carPlate: String,
  address: String,
});

module.exports = mongoose.model("City", UserSchema);

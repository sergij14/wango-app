const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  carPlate: String,
  address: String,
});

module.exports = mongoose.model("User", UserSchema);

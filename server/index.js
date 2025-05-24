const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const City = require("./models/City");
const ParkingArea = require("./models/ParkingArea");
const ParkingSession = require("./models/ParkingSession");
const { calculatePrice } = require("./pricing");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/appDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/register", async (req, res) => {
  const { email, address, carPlate } = req.body;
  const user = await User.create({ email, address, carPlate });
  res.json(user);
});

app.post("/login", async (req, res) => {
  const { email, carPlate } = req.body;
  const user = await User.findOne({ email, carPlate });
  return user
    ? res.json(user)
    : res.status(401).json({ error: "Invalid login" });
});

app.post("/start", async (req, res) => {
  const { userId, parkingAreaId } = req.body;
  const session = await ParkingSession.create({
    user: userId,
    parkingArea: parkingAreaId,
    startTime: new Date(),
  });
  res.json(session);
});

app.post("/stop", async (req, res) => {
  const { sessionId } = req.body;
  const session = await ParkingSession.findById(sessionId).populate({
    path: "parkingArea",
    populate: { path: "city" },
  });

  const endTime = new Date();
  const price = calculatePrice(
    session.parkingArea.city.name,
    session.startTime,
    endTime
  );
  session.endTime = endTime;
  session.price = price;
  await session.save();
  res.json(session);
});

app.get("/sessions/:userId", async (req, res) => {
  const sessions = await ParkingSession.find({
    user: req.params.userId,
  }).populate({
    path: "parkingArea",
    populate: { path: "city" },
  });
  res.json(sessions);
});

app.get("/cities", async (req, res) => {
  const cities = await City.find().lean();
  console.log(cities);

  for (let city of cities) {
    const parkingAreas = await ParkingArea.find({ city: city._id });
    city.parkingAreas = parkingAreas;
  }
  res.json(cities);
});

app.listen(3001, async () => {
  console.log("Server running on http://localhost:3001");

  if ((await City.countDocuments()) === 0) {
    const ny = await City.create({ name: "New York" });
    const dc = await City.create({ name: "Washington" });
    await ParkingArea.create([
      { name: "Manhattan", city: ny._id },
      { name: "Brooklyn", city: ny._id },
      { name: "Capitol Hill", city: dc._id },
    ]);
  }

  // await City.deleteMany({})
  // await User.deleteMany({})
  // await ParkingArea.deleteMany({})
  // await ParkingSession.deleteMany({})
});

module.exports = app;

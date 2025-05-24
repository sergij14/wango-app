const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.connection.close();
});

test("Register and login", async () => {
  const user = await request(app).post("/register").send({ email: "test@test.com", address: "123", carPlate: "ABC123" });
  const login = await request(app).post("/login").send({ email: "test@test.com", carPlate: "ABC123" });
  expect(login.statusCode).toBe(200);
});

test("Invalid login", async () => {
  const login = await request(app).post("/login").send({ email: "not@found.com", carPlate: "XYZ" });
  expect(login.statusCode).toBe(401);
});

import React, { useState } from "react";
import useAppStore from "../store";
import api from "../api";

export default function Register() {
  const setMessage = useAppStore((s) => s.setMessage);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [carPlate, setCarPlate] = useState("");

  const handleRegister = async () => {
    if (!email || !address || !carPlate) {
      setMessage("Please fill all register fields");
      return;
    }
    try {
      await api.register({ email, address, carPlate });
      setMessage("Registered successfully. Please login.");
      setEmail("");
      setAddress("");
      setCarPlate("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="Car Plate" value={carPlate} onChange={(e) => setCarPlate(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
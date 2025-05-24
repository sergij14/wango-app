import React, { useState } from "react";
import useAppStore from "../store";
import api from "../api";

export default function Login() {
  const setUser = useAppStore((s) => s.setUser);
  const setMessage = useAppStore((s) => s.setMessage);
  const [email, setEmail] = useState("");
  const [carPlate, setCarPlate] = useState("");

  const handleLogin = async () => {
    if (!email || !carPlate) {
      setMessage("Please fill all login fields");
      return;
    }
    try {
      const res = await api.login({ email, carPlate });
      setUser(res.data);
      setMessage("Logged in successfully");
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Car Plate" value={carPlate} onChange={(e) => setCarPlate(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
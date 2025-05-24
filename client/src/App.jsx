import React, { useState, useEffect } from "react";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export default function App() {
  // User states
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [carPlate, setCarPlate] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginCarPlate, setLoginCarPlate] = useState("");

  // Cities and Parking Areas
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [parkingAreas, setParkingAreas] = useState([]);
  const [selectedParkingAreaId, setSelectedParkingAreaId] = useState("");

  // Parking sessions
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);

  const [message, setMessage] = useState("");

  // Load cities on user login
  useEffect(() => {
    if (user) {
      fetchCities();
      fetchSessions();
    }
  }, [user]);

  console.log(message);

  // Fetch cities + parking areas
  const fetchCities = async () => {
    try {
      const res = await axios.get(`${backendURL}/cities`);
      setCities(res.data);
      setSelectedCityId("");
      setParkingAreas([]);
      setSelectedParkingAreaId("");
    } catch (err) {
      console.error(err);
    }
  };

  // When city changes, update parking areas dropdown
  useEffect(() => {
    if (!selectedCityId) {
      setParkingAreas([]);
      setSelectedParkingAreaId("");
      return;
    }
    const city = cities.find((c) => c._id === selectedCityId);
    if (city) {
      setParkingAreas(city.parkingAreas || []);
      setSelectedParkingAreaId("");
    }
  }, [selectedCityId]);

  // Fetch user parking sessions
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${backendURL}/sessions/${user._id}`);
      setSessions(res.data);
      // Check if any active session (no endTime)
      const active = res.data.find((s) => !s.endTime);
      setActiveSession(active || null);
    } catch (err) {
      console.error(err);
    }
  };

  // Register
  const handleRegister = async () => {
    if (!email || !address || !carPlate) {
      setMessage("Please fill all register fields");
      return;
    }
    try {
      await axios.post(`${backendURL}/register`, { email, address, carPlate });
      setMessage("Registered successfully. Please login.");
      setEmail("");
      setAddress("");
      setCarPlate("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  // Login
  const handleLogin = async () => {
    if (!loginEmail || !loginCarPlate) {
      setMessage("Please fill all login fields");
      return;
    }
    try {
      const res = await axios.post(`${backendURL}/login`, {
        email: loginEmail,
        carPlate: loginCarPlate,
      });
      setUser(res.data);
      setLoginEmail("");
      setLoginCarPlate("");
      setMessage("Logged in successfully");
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setActiveSession(null);
    setSessions([]);
    setSelectedCityId("");
    setParkingAreas([]);
    setSelectedParkingAreaId("");
    setMessage("");
  };

  // Start parking
  const handleStart = async () => {
    if (!selectedParkingAreaId) {
      setMessage("Select a parking area");
      return;
    }
    try {
      const res = await axios.post(`${backendURL}/start`, {
        userId: user._id,
        parkingAreaId: selectedParkingAreaId,
      });
      setActiveSession(res.data);
      setMessage("Parking started");
      fetchSessions();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to start parking");
    }
  };

  // Stop parking
  const handleStop = async () => {
    if (!activeSession) return;
    try {
      const res = await axios.post(`${backendURL}/stop`, {
        sessionId: activeSession._id,
      });
      setMessage(`Parking stopped. Price: $${res.data.price.toFixed(2)}`);
      setActiveSession(null);
      fetchSessions();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to stop parking");
    }
  };

  return (
    <div
      style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}
    >
      <h1>On-Street Parking App</h1>

      {!user ? (
        <>
          <h2>Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Car Plate Number"
            value={carPlate}
            onChange={(e) => setCarPlate(e.target.value)}
          />
          <br />
          <button onClick={handleRegister}>Register</button>

          <hr />

          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Car Plate Number"
            value={loginCarPlate}
            onChange={(e) => setLoginCarPlate(e.target.value)}
          />
          <br />
          <button onClick={handleLogin}>Login</button>
        </>
      ) : (
        <>
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogout}>Logout</button>

          <hr />

          <h3>Select City & Parking Area</h3>
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
          >
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
          <br />
          <select
            value={selectedParkingAreaId}
            onChange={(e) => setSelectedParkingAreaId(e.target.value)}
            disabled={!parkingAreas.length}
          >
            <option value="">-- Select Parking Area --</option>
            {parkingAreas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>
          <br />
          {!activeSession ? (
            <button onClick={handleStart} disabled={!selectedParkingAreaId}>
              Start Parking
            </button>
          ) : (
            <>
              <p>
                Parking started at:{" "}
                {new Date(activeSession.startTime).toLocaleString()}
              </p>
              <button onClick={handleStop}>Stop Parking</button>
            </>
          )}

          <hr />
          <h3>Your Parking Sessions</h3>
          {sessions.length === 0 && <p>No parking sessions yet.</p>}
          <ul>
            {sessions.map((s) => (
              <li key={s._id}>
                City: {s.parkingArea.city.name}, Area: {s.parkingArea.name},
                Started: {new Date(s.startTime).toLocaleString()}, Ended:{" "}
                {s.endTime ? new Date(s.endTime).toLocaleString() : "Active"},
                Price: {s.price !== undefined ? `$${s.price.toFixed(2)}` : "-"}
              </li>
            ))}
          </ul>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

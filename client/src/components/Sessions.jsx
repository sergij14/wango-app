import React, { useEffect } from "react";
import useAppStore from "../store";
import api from "../api";

export default function Sessions() {
  const {
    user,
    sessions,
    setSessions,
    activeSession,
    setActiveSession,
    selectedParkingAreaId,
    setMessage,
  } = useAppStore();

  const fetchSessions = async () => {
    const res = await api.getUserSessions(user._id);
    setSessions(res.data);
    const active = res.data.find((s) => !s.endTime);
    setActiveSession(active || null);
  };

  useEffect(() => {
    if (user) fetchSessions();
  }, [user]);

  const startParking = async () => {
    if (!selectedParkingAreaId) {
      setMessage("Select a parking area");
      return;
    }
    const res = await api.startParking({ userId: user._id, parkingAreaId: selectedParkingAreaId });
    setActiveSession(res.data);
    setMessage("Parking started");
    fetchSessions();
  };

  const stopParking = async () => {
    const res = await api.stopParking({ sessionId: activeSession._id });
    setActiveSession(null);
    setMessage(`Stopped. Price: $${res.data.price.toFixed(2)}`);
    fetchSessions();
  };

  return (
    <div>
      {activeSession ? (
        <>
          <p>Started at: {new Date(activeSession.startTime).toLocaleString()}</p>
          <button onClick={stopParking}>Stop Parking</button>
        </>
      ) : (
        <button onClick={startParking} disabled={!selectedParkingAreaId}>
          Start Parking
        </button>
      )}
      <h3>Your Parking Sessions</h3>
      <ul>
        {sessions.map((s) => (
          <li key={s._id}>
            City: {s.parkingArea.city.name}, Area: {s.parkingArea.name}, Start:{" "}
            {new Date(s.startTime).toLocaleString()}, End:{" "}
            {s.endTime ? new Date(s.endTime).toLocaleString() : "Active"}, Price:{" "}
            {s.price ? `$${s.price.toFixed(2)}` : "-"}
          </li>
        ))}
      </ul>
    </div>
  );
}
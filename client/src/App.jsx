import React from "react";
import useAppStore from "./store";
import Register from "./components/Register";
import Login from "./components/Login";
import Sessions from "./components/Sessions";
import Cities from "./components/Cities";

export default function App() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const setMessage = useAppStore((s) => s.setMessage);
  const message = useAppStore((s) => s.message);

  const handleLogout = () => {
    setUser(null);
    setMessage("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial" }}>
      <h1>On-Street Parking App</h1>
      {!user ? (
        <>
          <Register />
          <hr />
          <Login />
        </>
      ) : (
        <>
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogout}>Logout</button>
          <hr />
          <Cities />
          <Sessions />
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

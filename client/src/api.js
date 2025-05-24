import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const parkingApi = {
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
  startParking: (data) => api.post("/start", data),
  stopParking: (data) => api.post("/stop", data),
  getCities: () => api.get("/cities"),
  getUserSessions: (userId) => api.get(`/sessions/${userId}`),
};

export default parkingApi;
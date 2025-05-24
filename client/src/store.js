import { create } from "zustand";

const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  cities: [],
  setCities: (cities) => set({ cities }),

  selectedCityId: "",
  setSelectedCityId: (id) => set({ selectedCityId: id }),

  parkingAreas: [],
  setParkingAreas: (areas) => set({ parkingAreas: areas }),

  selectedParkingAreaId: "",
  setSelectedParkingAreaId: (id) => set({ selectedParkingAreaId: id }),

  activeSession: null,
  setActiveSession: (session) => set({ activeSession: session }),

  sessions: [],
  setSessions: (sessions) => set({ sessions }),

  message: "",
  setMessage: (message) => set({ message }),
}));

export default useAppStore;
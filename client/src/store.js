import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAppStore = create(
  persist(
    (set) => ({
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
    }),
    {
      name: "on-street-parking-storage",
    }
  )
);

export default useAppStore;

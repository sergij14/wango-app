import React, { useEffect } from "react";
import useAppStore from "../store";
import api from "../api";

export default function Cities() {
  const {
    cities,
    setCities,
    selectedCityId,
    setSelectedCityId,
    parkingAreas,
    setParkingAreas,
    selectedParkingAreaId,
    setSelectedParkingAreaId,
  } = useAppStore();

  useEffect(() => {
    const fetchCities = async () => {
      const res = await api.getCities();
      setCities(res.data);
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const city = cities.find((c) => c._id === selectedCityId);
    if (city) {
      setParkingAreas(city.parkingAreas || []);
      setSelectedParkingAreaId("");
    }
  }, [selectedCityId]);

  return (
    <div>
      <h3>Select City & Parking Area</h3>
      <select value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)}>
        <option value="">-- Select City --</option>
        {cities.map((city) => (
          <option key={city._id} value={city._id}>
            {city.name}
          </option>
        ))}
      </select>
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
    </div>
  );
}
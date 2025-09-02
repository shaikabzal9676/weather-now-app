import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

//  Custom location pin icon
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

// Smooth fly-to animation when city changes
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 10, { duration: 2 });
    }
  }, [position]);
  return null;
}

export default function CityMap({ city }) {
  if (!city || !city.latitude || !city.longitude) {
    return <p style={{ textAlign: "center" }}>No city selected</p>;
  }

  const position = [city.latitude, city.longitude];

  return (
    <div style={{ height: "400px", width: "100%", marginTop: "20px", borderRadius: "16px", overflow: "hidden", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
      <MapContainer
        center={position}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
       
<TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution="Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye"
/>
        <Marker position={position} icon={customIcon}>
          <Popup>
            <strong>{city.name}</strong> <br />
            Lat: {city.latitude.toFixed(2)}, Lon: {city.longitude.toFixed(2)}
          </Popup>
        </Marker>

        {/* ✅ Fly animation when city changes */}
        <FlyToLocation position={position} />
      </MapContainer>
    </div>
  );
}

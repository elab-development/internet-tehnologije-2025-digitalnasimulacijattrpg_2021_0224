"use client";

import { useState } from "react";

import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import process from "process";

type MarkerData = {
  position: { lat: number; lng: number };
  color: string;
  label: string;
};


export default function Page() {

  const [showCompetition, setShowCompetition] = useState(true);
  const [showCafe, setShowCafe] = useState(true);

  const fakultetMarkeri: MarkerData[] = [ 
    { position: { lat: 44.7728002, lng: 20.4752322 }, label: "Konacna destinacija [FON]", color: "red" },
  ];

  const cafeMarkeri: MarkerData[] = [
    { position: { lat: 44.771203, lng: 20.4764282 }, label: "Development centar [PALADA]", color: "blue" },
  ];

  
  
  const [userMarkers, setUserMarkers] = useState<MarkerData[]>([]);

  const handleMapClick = (event: any ) => {
    if (!event.lat || !event.lng) return;

    const newMarker: MarkerData = {
      position: { lat: event.lat, lng: event.lng },
      label: `User Marker ${userMarkers.length + 1}`,
      color: "green",
    };
    setUserMarkers((prev) => [...prev, newMarker]);
  };
const allMarkers = [
    ...(showCompetition ? fakultetMarkeri : []),
    ...(showCafe ? cafeMarkeri : []),
    ...userMarkers,
  ];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      {/* Layer toggles */}
      <div
        style={{
          position: "absolute",
          border: "1px solid white",
          top: 35,
          left: 5,
          zIndex: 10,
          background: "black",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={showCompetition}
            onChange={() => setShowCompetition((v) => !v)}
          />{" "}
          Competition Layer
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showCafe}
            onChange={() => setShowCafe((v) => !v)}
          />{" "}
          Cafe Layer
        </label>
      </div>

      {/* Mapa */}
      <Map
        style={{ width: "80%", height: "1000px", margin: "0 auto", marginTop: "2rem" , position: "absolute", left: "50%", transform: "translateX(-50%)" }}
        defaultCenter={{ lat: 44.7705, lng: 20.4700 }} // Voždovac
        defaultZoom={14}
        gestureHandling="greedy"
        disableDefaultUI
        onClick={handleMapClick}
      >
        {/* Competition markers */}
        {showCompetition &&
          fakultetMarkeri.map((m, i) => (
            <Marker
              key={`comp-${i}`}
              position={m.position}
              label={m.label}
              icon={{
                path: "M0-48c-9.9,0-18,8.1-18,18c0,13.5,18,30,18,30s18-16.5,18-30C18-39.9,9.9-48,0-48z",
                fillColor: m.color,
                fillOpacity: 1,
                strokeWeight: 1,
                scale: 1,
              }}
            />
          ))}

        {/* Cafe markers */}
        {showCafe &&
          cafeMarkeri.map((m, i) => (
            <Marker
              key={`cafe-${i}`}
              position={m.position}
              label={m.label}
              icon={{
                path: "M0-48c-9.9,0-18,8.1-18,18c0,13.5,18,30,18,30s18-16.5,18-30C18-39.9,9.9-48,0-48z",
                fillColor: m.color,
                fillOpacity: 1,
                strokeWeight: 1,
                scale: 1,
              }}
            />
          ))}

        {/* User markers */}
        {userMarkers.map((m, i) => (
          <Marker
            key={`user-${i}`}
            position={m.position}
            label={m.label}
            icon={{
              path: "M0-48c-9.9,0-18,8.1-18,18c0,13.5,18,30,18,30s18-16.5,18-30C18-39.9,9.9-48,0-48z",
              fillColor: m.color,
              fillOpacity: 1,
              strokeWeight: 1,
              scale: 5,
            }}
          />
        ))}

        {/* InfoWindows */}
        {allMarkers.map((m, i) => (
          <InfoWindow
            key={`infowindow-${i}`}
            position={m.position}
            pixelOffset={[0,-30]}
          >
              <div style={{ color: "white", background: "black", padding: "5px", borderRadius: "5px" }}>
                <strong>{m.label}</strong>
                <p>Lat: {m.position.lat.toFixed(4)}</p>
                <p>Lng: {m.position.lng.toFixed(4)}</p>
              </div>
          </InfoWindow>
        ))}
      </Map>
    </APIProvider>
  );
}

"use client";
import dynamic from 'next/dynamic';

import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGlobalContext } from "@/app/context/globalContext";


const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), {
 ssr: false,
});

const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), {
 ssr: false,
});

function FlyToActiveCity({ activeCityCords }) {
 const map = useMap();

 useEffect(() => {
  if (activeCityCords) {
   const zoomLev = 13;
   const flyToOptions = {
    duration: 1.5,
   };

   map.flyTo(
    [activeCityCords.lat, activeCityCords.lon],
    zoomLev,
    flyToOptions
   );
  }
 }, [activeCityCords, map]);

 return null;
}

function Mapbox() {
 const { forecast } = useGlobalContext(); // Your coordinates

 const activeCityCords = forecast?.coord;

 if (!forecast || !forecast.coord || !activeCityCords) {
  return (
   <div>
    <h1>Loading</h1>
   </div>
  );
 }

 return (
  <div className="flex-1 basis-[50%] border rounded-lg">
   <MapContainer
    center={[activeCityCords.lat, activeCityCords.lon]}
    zoom={13}
    scrollWheelZoom={false}
    className="rounded-lg m-4 h-full w-full"
   >
    <TileLayer
     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />

    <FlyToActiveCity activeCityCords={activeCityCords} />
   </MapContainer>
  </div>
 );
}

export default Mapbox;

// MapWithRoute.jsx
import React, { useEffect, useState, useMemo } from "react";
import { GoogleMap, Marker, DirectionsRenderer, OverlayView } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 40.7128, lng: -74.0060 };

function GoogleMapDisplay({ position1, position2, handleDistanceChange }) {
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState("");
    const mapKey = useMemo(() => {
        if (!position1 || !position2) return "default-map";
        return `map-${position1.lat}-${position1.lng}-${position2.lat}-${position2.lng}`;
    }, [position1, position2]);
    useEffect(() => {
        // Reset directions and distance when either position is missing
        if (!position1 || !position2)
            return;
        setDirections(null);

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: position1,
                destination: position2,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                    const leg = result.routes[0].legs[0];
                    setDistance(leg.distance.text);
                    handleDistanceChange(leg.distance.text);
                } else {
                    setDirections(null);
                    setDistance("");
                    handleDistanceChange("");
                }
            }
        );
    }, [position1, position2]);

    return (
        <GoogleMap
            key={mapKey}
            mapContainerStyle={containerStyle}
            center={position1 || defaultCenter}
            zoom={position1 ? 10 : 5}
        >
            {position1 && <Marker position={position1} />}
            {position2 && <Marker position={position2} />}
            {directions && <OverlayView
                position={{
                    lat: (position1.lat + position2.lat) / 2,
                    lng: (position1.lng + position2.lng) / 2,
                }}
                mapPaneName={OverlayView.OVERLAY_LAYER}
            >
                <div className="border border-gray-400 bg-gray-200 text-gray-900 py-2 px-4 rounded-sm shadow-sm w-24 text-center font-medium text-sm">{distance}</div>
            </OverlayView>}
            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    );
}

export default GoogleMapDisplay;
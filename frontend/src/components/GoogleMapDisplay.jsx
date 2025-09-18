// MapWithRoute.jsx
import React, { useEffect, useState, useMemo } from "react";
import { GoogleMap, Marker, DirectionsRenderer, OverlayView } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 40.7128, lng: -74.0060 };

function GoogleMapDisplay({ position1, position2, position3, handleDistanceChange, handleDeliveryDistanceChange }) {
    const [directions, setDirections] = useState(null);
    const [straightDirections, setStraightDirections] = useState(null);
    const [distance, setDistance] = useState("");
    const mapKey = useMemo(() => {
        if (!position1 || !position2 || !position3) return "default-map";
        return `map-${position1.lat}-${position1.lng}-${position2.lat}-${position2.lng}-${position3.lat}-${position3.lng}`;
    }, [position1, position2, position3]);
    useEffect(() => {
        // Reset directions and distance when either position is missing
        if (!position1 || !position2 || !position3)
            return;
        setDirections(null);

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: position1,
                destination: position1, // back to start for round trip
                waypoints: [
                    { location: position2, stopover: true },
                    { location: position3, stopover: true },
                ],
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                    // Calculate total distance by summing all legs
                    const route = result.routes[0];
                    let totalDistance = 0;
                    route.legs.forEach((leg) => {
                        totalDistance += leg.distance.value; // meters
                    });

                    // Convert meters to km (or miles if needed)
                    const totalKm = (totalDistance / 1000).toFixed(2) + " km";
                    setDistance(totalKm);
                    handleDistanceChange(totalKm);

                    // 👇 Leg[1] is B → C in this setup
                    if (route.legs[1]) {
                        const legBC = route.legs[1];
                        const directKm = (legBC.distance.value / 1000).toFixed(2) + " km";
                        handleDeliveryDistanceChange(directKm);
                    }
                } else {
                    setDirections(null);
                    setDistance("");
                    handleDistanceChange("");
                }
            }
        );
        directionsService.route(
            {
                origin: position1,
                destination: position3,
                waypoints: [{ location: position2, stopover: true }],
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setStraightDirections(result);
                }
            }
        );
    }, [position1, position2, position3]);

    return (
        <div className="mx-auto w-[60%] mb-8 border border-gray-400">
            <GoogleMap
                key={mapKey}
                mapContainerStyle={containerStyle}
                center={position1 || defaultCenter}
                zoom={position1 ? 10 : 5}
                options={{
                    streetViewControl: false,
                    mapTypeControl: true,
                    fullscreenControl: true,
                    zoomControl: true,
                    disableDefaultUI: true,
                    keyboardShortcuts: false,
                }}
            >
                {directions && (
                    <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />
                )}
                {straightDirections && (
                    <DirectionsRenderer directions={straightDirections} />
                )}

                {directions && (
                    <OverlayView
                        position={{
                            lat: (position1.lat + position2.lat + position3.lat) / 3,
                            lng: (position1.lng + position2.lng + position3.lng) / 3,
                        }}
                        mapPaneName={OverlayView.OVERLAY_LAYER}
                    >
                        <div className="border border-gray-400 bg-gray-200 text-gray-900 py-2 px-4 rounded-sm shadow-sm w-24 text-center font-medium text-sm">
                            {distance}
                        </div>
                    </OverlayView>
                )}

                {/* {position1 && (
                    <Marker
                        position={position1}
                        label={{ text: "A", color: "white" }}
                        zIndex={999}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }}
                    />
                )}
                {position2 && (
                    <Marker
                        position={position2}
                        label="B"
                        zIndex={999}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                    />
                )}
                {position3 && (
                    <Marker
                        position={position3}
                        label="C"
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        }}
                    />
                )} */}
            </GoogleMap>
        </div>
    );
}

export default GoogleMapDisplay;
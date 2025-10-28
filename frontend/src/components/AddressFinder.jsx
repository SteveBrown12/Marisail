import React, { useEffect, useRef, useState } from "react";

const AddressFinder = ({ onSelect }) => {
    const [candidates, setCandidates] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const debounceRef = useRef(null);
    const suppressFetch = useRef(false);
    const dummyElement = document.createElement("div");
    // Fetch candidates and add postal code
    const fetchCandidates = (query) => {
        if (!window.google || !query) return;
        const service = new window.google.maps.places.PlacesService(dummyElement);
        const request = {
            query,
            type: "address",
            fields: ["name", "formatted_address", "geometry", "place_id"],
        };

        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const geocoder = new window.google.maps.Geocoder();

                const enhancedResults = results.map((place) => {
                    return new Promise((resolve) => {
                        geocoder.geocode({ placeId: place.place_id }, (geoResults, geoStatus) => {
                            let postalCode = "";
                            if (geoStatus === "OK" && geoResults[0]) {
                                const components = geoResults[0].address_components;
                                postalCode =
                                    components.find((c) => c.types.includes("postal_code"))?.long_name ||
                                    "";
                            }
                            resolve({ ...place, postalCode });
                        });
                    });
                });

                Promise.all(enhancedResults).then((finalResults) => {
                    setCandidates(finalResults);
                });
            } else {
                setCandidates([]);
            }
        });
    };

    // Debounced typing
    useEffect(() => {
        if (suppressFetch.current) {
            suppressFetch.current = false;
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (inputValue.length > 2) {
                fetchCandidates(inputValue);
            } else {
                setCandidates([]);
            }
        }, 400);
    }, [inputValue]);

    // When selecting a candidate
    const handleSelect = (place) => {
        if (place.geometry) {
            setInputValue(place.formatted_address || place.name);
            setCandidates([]); // hide dropdown
            suppressFetch.current = true;
            onSelect(place.formatted_address);
        }
    };

    return (
        <div className="dropdown w-full">
            {/* Search Box */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Enter address or postal/zip code"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => {
                        if (inputValue.length > 2) fetchCandidates(inputValue);
                    }}
                    className="w-full border border-gray-400 rounded-lg p-2 focus:ring focus:ring-blue-300"
                />

                {/* Candidate Dropdown */}
                {candidates.length > 0 && (
                    <ul className="absolute z-50 bg-white border rounded shadow mt-1 w-full max-h-60 overflow-y-auto">
                        {candidates.map((place, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(place)}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                            >
                                {place.formatted_address}{" "}
                                {place.postalCode && `(${place.postalCode})`}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AddressFinder;
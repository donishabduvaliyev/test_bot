import React, { useState, useEffect, useRef } from "react";

const YandexMapModal = ({ onClose, onSave }) => {
    const [locationName, setLocationName] = useState("");
    const [coordinates, setCoordinates] = useState(null);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const placemark = useRef(null);

    useEffect(() => {
        window.ymaps.ready(() => {
            mapInstance.current = new window.ymaps.Map(mapRef.current, {
                center: [55.751244, 37.618423], // Default center (Moscow)
                zoom: 10,
                controls: ["zoomControl", "geolocationControl"],
            });

            // Click event to select location
            mapInstance.current.events.add("click", (e) => {
                const coords = e.get("coords");
                setCoordinates(coords);

                // Remove previous placemark if exists
                if (placemark.current) {
                    mapInstance.current.geoObjects.remove(placemark.current);
                }

                // Add new placemark
                placemark.current = new window.ymaps.Placemark(coords, {}, { preset: "islands#redDotIcon" });
                mapInstance.current.geoObjects.add(placemark.current);
            });
        });
    }, []);

    // Function to get user's current location
    const goToMyLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                setCoordinates(userCoords);

                // Move map to user's location
                mapInstance.current.setCenter(userCoords, 15);

                // Remove old placemark and add new one
                if (placemark.current) {
                    mapInstance.current.geoObjects.remove(placemark.current);
                }
                placemark.current = new window.ymaps.Placemark(userCoords, {}, { preset: "islands#redDotIcon" });
                mapInstance.current.geoObjects.add(placemark.current);
            },
            (error) => {
                alert("Could not get your location: " + error.message);
            }
        );
    };

    const handleSave = () => {
        if (coordinates && locationName.trim()) {
            onSave({ name: locationName, coordinates });
            onClose();
        } else {
            alert("Please select a location and enter a name.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg text-black flex flex-col gap-3">
                <h2 className="text-xl font-bold">Select a Location</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={goToMyLocation}>
                    📍 Go to My Location
                </button>
                <div ref={mapRef} className="w-[400px] h-[300px]"></div>
                <input
                    type="text"
                    className="p-2 border rounded"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Enter location name"
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSave}>
                    ✅ Save Location
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
                    ❌ Cancel
                </button>
            </div>
        </div>
    );
};

export default YandexMapModal;

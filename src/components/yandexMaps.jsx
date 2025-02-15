import React, { useState, useEffect, useRef } from "react";

const YandexMapModal = ({ onClose, onSave }) => {
    const [locationName, setLocationName] = useState("");
    const [coordinates, setCoordinates] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        window.ymaps.ready(() => {
            const map = new window.ymaps.Map(mapRef.current, {
                center: [55.751244, 37.618423], // Default center (Moscow)
                zoom: 10,
                controls: ["zoomControl"],
            });

            // Click event to select location
            map.events.add("click", (e) => {
                const coords = e.get("coords");
                setCoordinates(coords);
            });
        });
    }, []);

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
                <div ref={mapRef} className="w-[400px] h-[300px]"></div>
                <input
                    type="text"
                    className="p-2 border rounded"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Enter location name"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
                    Save Location
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default YandexMapModal;

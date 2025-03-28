import React, { useState, useEffect, useRef } from "react";

const YandexMapModal = ({ onClose, onSave }) => {
    const [locationName, setLocationName] = useState("");
    const [coordinates, setCoordinates] = useState(null);
    const [distance, setDistance] = useState(null); // Store calculated distance
    const [deliveryPrice, setDeliveryPrice] = useState(null); // Store calculated price
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const placemark = useRef(null);

    const centerCoords = [41.001380, 71.619064]; // Restaurant coordinates

    useEffect(() => {
        window.ymaps.ready(() => {
            mapInstance.current = new window.ymaps.Map(mapRef.current, {
                center: centerCoords,
                zoom: 10,
                controls: ["zoomControl", "geolocationControl"],
            });

            // Click event to select location
            mapInstance.current.events.add("click", (e) => {
                const coords = e.get("coords");
                setCoordinates(coords);
                addPlacemark(coords);
                calculateDistance(coords); // Call distance function
            });
        });
    }, []);

    // Function to add a placemark
    const addPlacemark = (coords) => {
        if (placemark.current) {
            mapInstance.current.geoObjects.remove(placemark.current);
        }
        placemark.current = new window.ymaps.Placemark(coords, {}, { preset: "islands#redDotIcon" });
        mapInstance.current.geoObjects.add(placemark.current);
    };

    // Function to get user's current location
    const goToMyLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                setCoordinates(userCoords);
                mapInstance.current.setCenter(userCoords, 15);
                addPlacemark(userCoords);
                calculateDistance(userCoords); // Call distance function
            },
            (error) => {
                alert("Could not get your location: " + error.message);
            }
        );
    };

    // Function to calculate distance using Yandex Routing API
    const calculateDistance = (userCoords) => {
        window.ymaps.route([centerCoords, userCoords]).then((route) => {
            const drivingDistance = route.getLength() / 1000; // Convert meters to km
            setDistance(drivingDistance.toFixed(2));

            const pricePerKm = 1.5; // Example price per km
            const calculatedPrice = drivingDistance * pricePerKm;
            setDeliveryPrice(calculatedPrice.toFixed(2));
        }).catch((error) => {
            console.error("Error calculating route:", error);
        });
    };

    const handleSave = () => {
        if (coordinates && locationName.trim()) {
            onSave({ name: locationName, coordinates, distance, deliveryPrice });
            onClose();
        } else {
            alert("Please select a location and enter a name.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg text-black flex flex-col gap-3">
                <h2 className="text-xl font-bold">Manzil tanlash</h2>
                <button className="bg-red-500 text-white px-4 py-2 rounded mb-2" onClick={goToMyLocation}>
                    📍 Mening turgan joyim
                </button>
                <div ref={mapRef} className="w-[400px] h-[300px]"></div>
                <input
                    type="text"
                    className="p-2 border-2 rounded border-red-500"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="manzil nomi"
                />
                {distance && (
                    <div className="mt-2 text-lg">
                        <p>🚗 Masofa: <b>{distance} km</b></p>
                        <p>💰 Yetkazib berish narxi: <b>${deliveryPrice}</b></p>
                    </div>
                )}
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSave}>
                    ✅ Saqlash
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
                    ❌ Bekor qilish
                </button>
            </div>
        </div>
    );
};

export default YandexMapModal;

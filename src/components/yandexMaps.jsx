import React, { useState, useEffect, useRef } from "react";

const YandexMapModal = ({ onClose, onSave }) => {
    const [locationName, setLocationName] = useState("");
    const [coordinates, setCoordinates] = useState(null);
    const [distance, setDistance] = useState(null); // Store calculated distance
    const [deliveryPrice, setDeliveryPrice] = useState(null); // Store calculated price
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const placemark = useRef(null);
    const routeRef = useRef(null); // At the top with other refs

    const toYandexCoords = ([lat, lon]) => [lat, lon]; // or flip if needed

    const centerCoords = [41.001380, 71.619064];
    // const centerCoords = [71.619064, 41.001380];
    // console.log("Yandex Maps Object:", window.ymaps);



    useEffect(() => {
        window.ymaps.ready(() => {
            if (!window.ymaps.route) {
                console.error("Yandex Routing API is not available. Check your API key or enable the Routing API.");
                return;
            }

            mapInstance.current = new window.ymaps.Map(mapRef.current, {
                center: centerCoords,
                zoom: 15,
                controls: ["zoomControl", "geolocationControl"],
            });

            mapInstance.current.events.add("click", (e) => {
                const coords = e.get("coords");

                setCoordinates(coords);
                addPlacemark(coords);
                calculateDistance(coords); // Call distance function
            });
        });
    }, []);

    const haversineDistance = (coord1, coord2) => {
        const toRad = (x) => (x * Math.PI) / 180;

        const [lat1, lon1] = coord1;
        const [lat2, lon2] = coord2;

        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };



    // Function to add a placemark
    const addPlacemark = (coords) => {
        if (placemark.current) {
            mapInstance.current.geoObjects.remove(placemark.current);
        }
        placemark.current = new window.ymaps.Placemark(coords, {}, { preset: "islands#redDotIcon" });
        mapInstance.current.geoObjects.add(placemark.current);
    };



    const goToMyLocation = () => {
        if (!mapInstance.current) {
            alert("Map is not ready yet. Please wait a moment.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                // const userCoords = [position.coords.longitude, position.coords.latitude]; 

                setCoordinates(userCoords);
                mapInstance.current.setCenter(userCoords, 15);
                addPlacemark(userCoords);
                calculateDistance(userCoords);
            },
            (error) => {
                alert("Could not get your location: " + error.message);
            }
        );
    };

    // Function to calculate distance using Yandex Routing API
    // const calculateDistance = (userCoords) => {
    //     window.ymaps.route([centerCoords, userCoords]).then((route) => {
    //         const drivingDistance = route.getLength() / 1000; // Convert meters to km
    //         setDistance(drivingDistance.toFixed(2));

    //         const pricePerKm = 10000; // Example price per km
    //         const calculatedPrice = drivingDistance * pricePerKm;
    //         setDeliveryPrice(calculatedPrice.toFixed(2));
    //     }).catch((error) => {
    //         console.error("Error calculating route:", error);
    //     });
    // };

    // const calculateDistance = (userCoords) => {
    //     window.ymaps.route([centerCoords, userCoords]).then((route) => {
    //         // Show the route on the map
    //         mapInstance.current.geoObjects.add(route); // ✅ Add route line to map

    //         // Get distance in kilometers
    //         const drivingDistance = route.getLength() / 1000;
    //         setDistance(drivingDistance.toFixed(2));

    //         const pricePerKm = 10000;
    //         const calculatedPrice = drivingDistance * pricePerKm;
    //         setDeliveryPrice(calculatedPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    //     }).catch((error) => {
    //         console.error("Error calculating route:", error);
    //     });
    // };


    const calculateDistance = (userCoords) => {
        // Remove previous route if exists
        if (routeRef.current) {
            mapInstance.current.geoObjects.remove(routeRef.current);
            routeRef.current = null;
        }

        const straightDistance = haversineDistance(centerCoords, userCoords);

        if (straightDistance < 0.5) {
            setDistance(straightDistance.toFixed(2));
            const calculatedPrice = straightDistance * 10000;
            setDeliveryPrice(calculatedPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            return;
        }

        const yandexStart = toYandexCoords(centerCoords);
        const yandexEnd = toYandexCoords(userCoords);

        window.ymaps.route([yandexStart, yandexEnd]).then((route) => {
            routeRef.current = route;
            mapInstance.current.geoObjects.add(route);

            const drivingDistance = route.getLength() / 1000;
            setDistance(drivingDistance.toFixed(2));
            const calculatedPrice = drivingDistance * 10000;
            setDeliveryPrice(calculatedPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
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
                        <p>💰 Yetkazib berish narxi: <b>UZS{deliveryPrice}</b></p>
                    </div>
                )}
                <button
                    disabled={!coordinates || !locationName.trim()}
                    className={`px-4 py-2 rounded ${!coordinates || !locationName.trim()
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-500 text-white"
                        }`}
                    onClick={handleSave}
                >
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

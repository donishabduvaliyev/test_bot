import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import YandexMapModal from "../components/yandexMaps";
import { useCart } from "../components/context";

function CustomerInfo() {
    const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
    const [selectedRadio, setSelectedRadio] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [comment, setComment] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [newLocation, setNewLocation] = useState({ name: "", coordinates: "" });
    const {navigate , cart} = useCart()

    useEffect(() => {
        if (window.Telegram.WebApp.initDataUnsafe?.user?.id) {
            const chatId = window.Telegram.WebApp.initDataUnsafe.user.id;

            fetch(`http://localhost:5000/get-phone/${chatId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.phoneNumber) {
                        setUserInfo(prev => ({ ...prev, phone: data.phoneNumber }));
                    }
                })
                .catch((err) => console.error("Fetch error:", err));
        }
    }, []);

    useEffect(() => {
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe?.user;
        if (user) {
            setUserInfo(prev => ({ ...prev, name: user.first_name }));
        }
    }, []);

    useEffect(() => {
        if (showLocationModal) {
            window.ymaps.ready(() => {
                const map = new window.ymaps.Map("yandex-map", {
                    center: [55.751574, 37.573856], // Default to Moscow, change if needed
                    zoom: 10,
                });

                let placemark;
                map.events.add("click", function (e) {
                    const coords = e.get("coords");
                    if (placemark) {
                        placemark.geometry.setCoordinates(coords);
                    } else {
                        placemark = new window.ymaps.Placemark(coords, {}, { draggable: true });
                        map.geoObjects.add(placemark);
                    }
                    setNewLocation(prev => ({ ...prev, coordinates: coords.join(",") }));
                });
            });
        }
    }, [showLocationModal]);

    const handleSubmitLocation = () => {
        if (newLocation.name.trim()) {
            setLocations(prev => [...prev, { ...newLocation, id: prev.length + 1 }]);
            setSelectedLocation(locations.length + 1);
            setShowLocationModal(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedLoc = locations.find(loc => loc.id === parseInt(selectedLocation));
        console.log({ ...userInfo, deliveryType: selectedRadio, selectedLoc, comment });
        alert("Form submitted successfully!");
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold">Fill in Your Information</h1>
            <form className="bg-gray-700 p-5 rounded-lg flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="text" value={userInfo.name} className="p-2 bg-gray-300 text-black rounded" onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))} />
                <input type="text" value={userInfo.phone} className="p-2 bg-gray-300 text-black rounded" onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))} />
                <div className="flex gap-4">
                    <label className={`px-6 py-2 rounded cursor-pointer ${selectedRadio === "delivery" ? "bg-red-500" : "bg-gray-500"}`}>
                        <input type="radio" value="delivery" name="address" className="hidden" onChange={() => setSelectedRadio("delivery")} /> Delivery
                    </label>
                    <label className={`px-6 py-2 rounded cursor-pointer ${selectedRadio === "takeout" ? "bg-green-500" : "bg-gray-500"}`}>
                        <input type="radio" value="takeout" name="address" className="hidden" onChange={() => setSelectedRadio("takeout")} /> Takeout
                    </label>
                </div>

                {selectedRadio === "delivery" && (
                    <div className="flex flex-col gap-2">
                        <select className="p-2 bg-gray-300 text-black rounded" value={selectedLocation} onChange={(e) => {
                            if (e.target.value === "new") setShowLocationModal(true);
                            else setSelectedLocation(e.target.value);
                        }}>
                            <option value="">Select a location</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                            <option value="new">+ Select Location on Map</option>
                        </select>
                    </div>
                )}

                <textarea placeholder="Comment" className="p-2 bg-gray-300 text-black rounded" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                <button type="submit" className="bg-green-500 px-4 py-2 rounded">Submit</button>
            </form>

            {showLocationModal && (
                <YandexMapModal
                    onClose={() => setShowLocationModal(false)}
                    onSave={(newLoc) => {
                        setLocations([...locations, { ...newLoc, id: locations.length + 1 }]);
                        setSelectedLocation(locations.length + 1);
                    }}
                />
            )}


        </div>
    );
}

export default CustomerInfo;


// useEffect(() => {
//     const tg = window.Telegram.WebApp;
//     if (!tg) return;

//     tg.expand(); // Expands the web app to full screen

//     // Set up the main button
//     tg.MainButton.setText(`Go to Checkout ${cart}`);
//     tg.MainButton.hide(); // Hide by default

//     const handleMainButtonClick = () => {
//       navigate("/varoq");
//     };

//     tg.MainButton.onClick(handleMainButtonClick);

//     return () => {
//       tg.MainButton.offClick(handleMainButtonClick); // Cleanup on unmount
//     };
//   }, [navigate , cart]);

// useEffect(() => {
//     console.log("Cart updated:", cart);

//     const tg = window.Telegram.WebApp;
//     if (!tg) return;

//     if (cart.length > 0) {
//       tg.MainButton.show();
//     } else {
//       tg.MainButton.hide();
//     }
//   }, [cart]);
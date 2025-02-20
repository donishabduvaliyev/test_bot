import React, { useState, useEffect } from "react";
import { useCart } from "../components/context";
import YandexMapModal from "../components/yandexMaps";

function CustomerInfo() {
    const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
    const [selectedRadio, setSelectedRadio] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [comment, setComment] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [newLocation, setNewLocation] = useState({ name: "", coordinates: "" });

    const { navigate, cart } = useCart();

    const tg = window.Telegram.WebApp;

    useEffect(() => {
        if (tg) {
            tg.ready();
        }
    }, []);


    // ✅ Expand WebApp and set initial MainButton state
    useEffect(() => {
        const tg = window.Telegram.WebApp;

        if (tg) {
            tg.expand();
            tg.MainButton.setText(`Send Order (${cart.length} items)`);
            tg.MainButton.hide(); // Initially hidden
        }
    }, [tg]);

    useEffect(() => {
        const tg = window.Telegram.WebApp;

        if (tg) {
            tg.expand(); // Expands to full screen
            console.log("✅ Telegram WebApp initialized", tg);
        } else {
            console.error("❌ Telegram WebApp is not available");
        }
    }, []);

    // ✅ Load Telegram User Data
    useEffect(() => {
        const tg = window.Telegram.WebApp;

        if (tg?.initDataUnsafe?.user) {
            setUserInfo(prev => ({ ...prev, name: tg.initDataUnsafe.user.first_name }));
        }
    }, [tg]);

    // ✅ Fetch User's Phone Number from Backend
    // useEffect(() => {
    //     const chatId = tg?.initDataUnsafe?.user?.id;
    //     if (chatId) {
    //         fetch(`http://localhost:5000/get-phone/${chatId}`)
    //             .then((res) => res.json())
    //             .then((data) => {
    //                 if (data.phoneNumber) {
    //                     setUserInfo(prev => ({ ...prev, phone: data.phoneNumber }));
    //                 }
    //             })
    //             .catch((err) => console.error("Fetch error:", err));
    //     }
    // }, [tg]);

    // ✅ Show/Hide Main Button Based on Cart Items
    useEffect(() => {
        if (cart.length > 0) {
            tg?.MainButton.show();
        } else {
            tg?.MainButton.hide();
        }
    }, [cart, tg]);

    // ✅ Send User & Cart Data to Telegram on Main Button Click
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) return;

        const handleMainButtonClick = () => {
            const selectedLoc = locations.find(loc => loc.id === parseInt(selectedLocation));

            const orderData = [
                {
                    user: {
                        name: userInfo.name,
                        phone: userInfo.phone,
                        deliveryType: selectedRadio,
                        location: selectedLoc ? selectedLoc.name : "Not selected",
                        coordinates: selectedLoc ? selectedLoc.coordinates : "",
                        comment: comment,
                    }
                },
                {
                    cart: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            ];

            tg.sendData(JSON.stringify(orderData)); // Send order data to Telegram bot
            alert("Order Sent!");
            navigate("/");
        };

        tg.MainButton.onClick(handleMainButtonClick);
        return () => {
            tg.MainButton.offClick(handleMainButtonClick);
        };
    }, [navigate, userInfo, selectedRadio, selectedLocation, comment, cart, locations]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold">Fill in Your Information</h1>
            <form className="bg-gray-700 p-5 rounded-lg flex flex-col gap-4">
                <input type="text" value={userInfo.name} className="p-2 bg-gray-300 text-black rounded"
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))} />
                <input type="text" value={userInfo.phone} className="p-2 bg-gray-300 text-black rounded"
                    onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))} />

                <div className="flex gap-4">
                    <label className={`px-6 py-2 rounded cursor-pointer ${selectedRadio === "delivery" ? "bg-red-500" : "bg-gray-500"}`}>
                        <input type="radio" value="delivery" name="address" className="hidden"
                            onChange={() => setSelectedRadio("delivery")} /> Delivery
                    </label>
                    <label className={`px-6 py-2 rounded cursor-pointer ${selectedRadio === "takeout" ? "bg-green-500" : "bg-gray-500"}`}>
                        <input type="radio" value="takeout" name="address" className="hidden"
                            onChange={() => setSelectedRadio("takeout")} /> Takeout
                    </label>
                </div>

                {selectedRadio === "delivery" && (
                    <div className="flex flex-col gap-2">
                        <select className="p-2 bg-gray-300 text-black rounded" value={selectedLocation}
                            onChange={(e) => {
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

                <textarea placeholder="Comment" className="p-2 bg-gray-300 text-black rounded"
                    value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
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

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useCart } from "../components/context";
import YandexMapModal from "../components/yandexMaps";

function CustomerInfo() {
    const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
    const [userChatID , setUserChatID] = useState({chatID: ""})
    const [selectedRadio, setSelectedRadio] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [comment, setComment] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [newLocation, setNewLocation] = useState({ name: "", coordinates: "" });

    const { navigate, cart, setCart } = useCart();

    // Safely access Telegram WebApp
    const tg = window.Telegram?.WebApp;

    useEffect(() => {
        if (tg) {
            tg.ready();
        }
    }, [tg]); // Add tg as dependency

    const selectedLoc = locations.find(loc => loc.id === parseInt(selectedLocation));

    const orderData = useMemo(() => ({
        user: {
            userID: userChatID ,
            name: userInfo.name,
            phone: userInfo.phone,
            deliveryType: selectedRadio,
            location: selectedLoc ? selectedLoc.name : "Not selected",
            coordinates: selectedLoc ? selectedLoc.coordinates : "",
            comment: comment,
        },
        cart: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantit,
            topping: item.topping
        }))
    }), [userInfo, selectedRadio, selectedLoc, comment, cart ,userChatID]);


    // Initialize MainButton text and expand WebApp
    useEffect(() => {
        if (tg) {
            tg.expand();
            tg.MainButton.setText(`Send Order (${cart.length} items)`);
            tg.MainButton.hide();
        }
    }, [tg, cart.length]); // Add cart.length

    // Load user data from Telegram
    useEffect(() => {
        if (tg && tg.initDataUnsafe?.user) {
            setUserInfo(prev => ({ ...prev, name: tg.initDataUnsafe.user.first_name }));
            setUserChatID(prev =>({...prev , chatID: tg.initDataUnsafe.user.id}))
        }
    }, []);



    // Show/hide MainButton based on cart
    useEffect(() => {
        if (!tg) return;

        if (cart.length > 0) {
            tg.MainButton.setText(`Send Order (${cart.length} items)`);
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }, [cart.length]);


    const handleMainButtonClick = useCallback(async () => {
        if (!tg) return;

        try {

            const response = await fetch("https://backend-xzwz.onrender.com/web-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            // tg.sendData(JSON.stringify(orderData));

            const data = await response.json();
            if (data.success) {
                alert("✅ Order sent successfully!");

            } else {
                console.error("❌ Error:", data.error);
            }

            setTimeout(() => {
                setCart([]);
                navigate("/");
            }, 2000);

        } catch (err) {
            console.error("❌ Fetch Error:", err);
        }
    }, [orderData, navigate]);
    // Include tg

    // Bind MainButton click handler
    useEffect(() => {
        if (!tg) return;
        tg.MainButton.onClick(handleMainButtonClick);
        return () => tg.MainButton.offClick(handleMainButtonClick);
    }, [handleMainButtonClick, tg]);

    return (
        // ... (same as before)

        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold">Fill in Your Information</h1>
            <form className="bg-gray-700 p-5 rounded-lg flex flex-col gap-4">
                <input type="text" value={userInfo.name} className="p-2 bg-gray-300 text-black rounded"
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))} />
                <input type="text" placeholder="telefon raqamingiz" value={userInfo.phone} className="p-2 bg-gray-300 text-black rounded"
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
                    value={comment} onChange={(e) => setComment(e.target.value)}    ></textarea>
            </form>

            {showLocationModal && (
                <YandexMapModal
                    onClose={() => setShowLocationModal(false)}
                    onSave={(newLoc) => {
                        const updatedLocations = [...locations, { ...newLoc, id: locations.length + 1 }];
                        setLocations(updatedLocations);
                        setSelectedLocation(updatedLocations[updatedLocations.length - 1].id);
                    }}

                />
            )}
        </div>
    );
}

export default CustomerInfo;
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useCart } from "../components/context";
import YandexMapModal from "../components/yandexMaps";
import { time } from "framer-motion";

function CustomerInfo() {
    const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
    const [userChatID, setUserChatID] = useState()
    const [selectedRadio, setSelectedRadio] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [comment, setComment] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [newLocation, setNewLocation] = useState({ name: "", coordinates: "" });
    const [orderID, setOrderID] = useState(0)
    const [orderTime, setOrderTime] = useState('')
    const { navigate, cart, setCart, OrderPrice } = useCart();
    const [errors, setErrors] = useState({});


    // Safely access Telegram WebApp
    const tg = window.Telegram?.WebApp;

    useEffect(() => {
        if (tg) {
            tg.ready();
        }
    }, [tg]); // Add tg as dependency

    const selectedLoc = locations.find(loc => loc.id === parseInt(selectedLocation));

    const totalOrderPrice = selectedLoc && selectedLoc.deliveryPrice
    ? OrderPrice + selectedLoc.deliveryPrice
    : OrderPrice;


    const orderData = useMemo(() => ({


        user: {
            userID: userChatID,
            name: userInfo.name,
            phone: userInfo.phone,
            deliveryType: selectedRadio,
            location: selectedLoc ? selectedLoc.name : "Not selected",
            coordinates: selectedLoc ? selectedLoc.coordinates : "",
            comment: comment,
            deliveryPrice: selectedLoc ? selectedLoc.deliveryPrice : "",
            distance: selectedLoc ? selectedLoc.distance : ""
        },
        cart: cart.map(item => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            topping: item.toppings?.map(topping => topping.name),
            totalPrice: item.totalPrice,
            size: item.size,

        })),
        orderID: {
            id: orderID,
            time: orderTime,
            price: totalOrderPrice

        }
    }
    ), [userInfo, selectedRadio, selectedLoc, comment, cart, userChatID]);
    console.log(cart);
    console.log(orderData);

    console.log("📤 Sending Order Data:",);



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
            setUserChatID(tg.initDataUnsafe.user.id)
        }
    }, []);


    useEffect(() => {
        let randomNumber = Math.floor(Math.random() * 10000); // Generate a 4-digit random number
        let currentTime = new Date().getTime(); // Get current timestamp

        setOrderTime(currentTime);
        let newOrderID = userChatID + randomNumber + currentTime;

        setOrderID(newOrderID);

        console.log("Order Time:", currentTime);
        console.log("Order ID:", newOrderID);
    }, [userInfo, selectedRadio, selectedLoc, comment, cart, userChatID]);


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

    console.log(orderData);

    const handleMainButtonClick = useCallback(async () => {
        if (!tg) return;
    
        let validationErrors = {};
        if (!userInfo.name.trim()) validationErrors.name = "Ism kiriting";
        if (!userInfo.phone.trim()) validationErrors.phone = "Telefon raqamingizni kiriting";
        if (!selectedRadio) validationErrors.deliveryType = "Yetkazish turini tanlang";
        if (selectedRadio === "delivery" && !selectedLocation) validationErrors.location = "Manzilni tanlang";
    
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
    
            alert("❗ Iltimos, barcha ma'lumotlarni to'g'ri kiriting.\n\nOK tugmasini bosganingizdan so'ng davom etishingiz mumkin.");
            
            // Show MainButton again after alert is closed
            if (tg) {
                tg.MainButton.show();
            }
    
            return;
        }
    
        try {
            const response = await fetch("https://backend-eghk.onrender.com/web-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData, null, 2)
            });
    
            const data = await response.json();
            if (data.success) {
                alert("✅ Buyurtmangiz yuborildi!");
            } else {
                console.error("❌ Error:", data.error);
            }
    
            setTimeout(() => {
                setCart([]);
                navigate("/");
            }, 1000);
        } catch (err) {
            console.error("❌ Fetch Error:", err);
        }
    }, [orderData, navigate, tg, userInfo, selectedRadio, selectedLocation]);
    

    // Bind MainButton click handler
    useEffect(() => {
        if (!tg) return;
        tg.MainButton.onClick(handleMainButtonClick);
        return () => tg.MainButton.offClick(handleMainButtonClick);
    }, [handleMainButtonClick, tg]);

    return (


        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold">Ma'lumotlaringizni kiriting</h1>
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
                            <option value="">Manzilni tanlang</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                            <option value="new">+ Manzilni xaritadan olish</option>
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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CustomerInfo() {
    const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
    const [selectedRadio, setSelectedRadio] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [comment, setComment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        window.Telegram.WebApp.ready();
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe?.user;
        const phone = tg.initDataUnsafe?.user?.phone_number;
        if (user && phone) {
            setUserInfo({ name: user.first_name, phone: phone });
        }
    }, []);

    useEffect(() => {
        if (window.Telegram.WebApp.initDataUnsafe?.user?.id) {
            const chatId = window.Telegram.WebApp.initDataUnsafe.user.id;
    
            fetch(`http://localhost:5000/get-phone/${chatId}`)
                .then(res => res.json())
                .then(data => setUserInfo(prev => ({ ...prev, phone: data.phoneNumber })))
                .catch(err => console.error("Error fetching phone:", err));
        }
    }, []);
    

    const requestLocation = () => {
        window.Telegram.WebApp.showPopup({
            title: "Location Access",
            message: "Please share your location through Telegram",
            buttons: [{ text: "OK", type: "default" }],
        });

        window.Telegram.WebApp.sendData("request_location");
    };

    useEffect(() => {
        window.Telegram.WebApp.onEvent("location", (location) => {
            const newLoc = {
                id: locations.length + 1,
                name: "Telegram Location",
                coordinates: `${location.latitude},${location.longitude}`,
            };
            setLocations([...locations, newLoc]);
            setSelectedLocation(newLoc.id);
        });
    }, [locations]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedLoc = locations.find(loc => loc.id === parseInt(selectedLocation));
        console.log({ ...userInfo, deliveryType: selectedRadio, selectedLoc, comment });
        alert("Form submitted successfully!");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold">Fill in Your Information</h1>
            <form className="bg-gray-700 p-5 rounded-lg flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="text" value={userInfo.name} className="p-2 bg-gray-300 text-black rounded" readOnly />
                <input type="text" value={userInfo.phone} className="p-2 bg-gray-300 text-black rounded" readOnly />

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
                            if (e.target.value === "new") requestLocation();
                            else setSelectedLocation(e.target.value);
                        }}>
                            <option value="">Select a location</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                            <option value="new">+ Get Location from Telegram</option>
                        </select>
                    </div>
                )}

                <textarea placeholder="Comment" className="p-2 bg-gray-300 text-black rounded" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                <button type="submit" className="bg-green-500 px-4 py-2 rounded" onClick={() => navigate('/')}>Submit</button>
            </form>
        </div>
    );
}

export default CustomerInfo;

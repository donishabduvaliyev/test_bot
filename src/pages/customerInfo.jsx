import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CustomerInfo() {
    const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
    const [selectedRadio, setSelectedRadio] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [comment, setComment] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [newLocation, setNewLocation] = useState({ name: "", coordinates: "" });
    const navigate = useNavigate();

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

    const requestLocation = () => {
        window.Telegram.WebApp.openLocationDialog({}, (location) => {
            if (location) {
                setNewLocation({
                    name: "",
                    coordinates: `${location.latitude},${location.longitude}`
                });
                setShowLocationModal(true);
            }
        });
    };

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
                <button type="submit" className="bg-green-500 px-4 py-2 rounded">Submit</button>
            </form>

            {showLocationModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg text-black flex flex-col gap-3">
                        <h2 className="text-xl font-bold">Enter Location Name</h2>
                        <input type="text" className="p-2 border rounded" value={newLocation.name} onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))} placeholder="Location Name" />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmitLocation}>Save Location</button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowLocationModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerInfo;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import YandexMapModal from "../components/yandexMaps";

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
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe?.user;

        if (user) {
            setUserInfo((prev) => ({ ...prev, name: user.first_name }));

            if (user.id) {
                fetch(`http://localhost:5000/get-phone/${user.id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.phoneNumber) {
                            setUserInfo((prev) => ({ ...prev, phone: data.phoneNumber }));
                        }
                    })
                    .catch((err) => console.error("Fetch error:", err));
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedLoc = locations.find((loc) => loc.id === parseInt(selectedLocation));
        console.log({ ...userInfo, deliveryType: selectedRadio, selectedLoc, comment });
        alert("Form submitted successfully!");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold">Fill in Your Information</h1>
            <form className="bg-gray-700 p-5 rounded-lg flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInfo.name}
                    className="p-2 bg-gray-300 text-black rounded"
                    readOnly
                />
                <input
                    type="text"
                    value={userInfo.phone}
                    className="p-2 bg-gray-300 text-black rounded"
                    readOnly
                />
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
                        <select
                            className="p-2 bg-gray-300 text-black rounded"
                            value={selectedLocation}
                            onChange={(e) => {
                                if (e.target.value === "new") setShowLocationModal(true);
                                else setSelectedLocation(e.target.value);
                            }}
                        >
                            <option value="">Select a location</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
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

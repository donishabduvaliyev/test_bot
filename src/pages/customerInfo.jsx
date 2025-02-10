import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CustomerInfo() {
    const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
    const [selectedRadio, setSelectedRadio] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [comment, setComment] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newLocation, setNewLocation] = useState({ name: "", houseNumber: "", floor: "", coordinates: "" });
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    
    const navigate = useNavigate()



    const loadYandexMaps = (callback) => {
        if (window.ymaps) {
            callback();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=en_US";
        script.async = true;
        script.onload = callback;
        document.body.appendChild(script);
    };

    useEffect(() => {
        const mockUser = { name: "Norbert", phone: "1234567890" };
        const mockLocations = [
            { id: 1, name: "Home", coordinates: "41.299,69.204" },
            { id: 2, name: "Office", coordinates: "41.315,69.215" }
        ];
        setUserInfo(mockUser);
        setLocations(mockLocations);
    }, []);

    useEffect(() => {
        if (!showModal) return;

        loadYandexMaps(() => {
            window.ymaps.ready(() => {
                const newMap = new window.ymaps.Map("map", {
                    center: [41.299, 69.204],
                    zoom: 12,
                });

                const newMarker = new window.ymaps.Placemark(
                    [41.299, 69.204],
                    {},
                    { draggable: true }
                );

                newMap.geoObjects.add(newMarker);

                newMarker.events.add("dragend", function () {
                    const coords = newMarker.geometry.getCoordinates();
                    setNewLocation(prev => ({ ...prev, coordinates: `${coords[0]},${coords[1]}` }));
                    console.log("Selected coordinates:", coords);
                });

                setMap(newMap);
                setMarker(newMarker);
            });
        });
    }, [showModal]);






    const saveNewLocation = () => {
        if (!newLocation.coordinates) {
            alert("Please select a location on the map.");
            return;
        }
        const newLoc = {
            id: locations.length + 1,
            name: newLocation.name,
            houseNumber: newLocation.houseNumber,
            floor: newLocation.floor,
            coordinates: newLocation.coordinates
        };
        setLocations([...locations, newLoc]);
        setSelectedLocation(newLoc.id);
        setShowModal(false);
        setNewLocation({ name: "", houseNumber: "", floor: "", coordinates: "" });
    };

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
                <input type="text" value={userInfo.name}   className="p-2 bg-gray-300 text-black rounded"  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
                <input type="number" value={userInfo.phone}  className="p-2 bg-gray-300 text-black rounded"  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} />

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
                            if (e.target.value === "new") setShowModal(true);
                            else setSelectedLocation(e.target.value);
                        }}>
                            <option value="">Select a location</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                            <option value="new">+ Add New Location</option>
                        </select>
                    </div>
                )}

                <textarea placeholder="Comment" className="p-2 bg-gray-300 text-black rounded" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                <button type="submit" className="bg-green-500 px-4 py-2 rounded" onClick={()=> navigate('varoq')}>Submit</button>
            </form>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg text-black flex flex-col gap-3">
                        <h2 className="text-xl font-bold">Set Your Location</h2>
                        <div id="map" className="w-96 h-64 bg-gray-300"></div>
                        <input type="text" placeholder="Location Name" className="p-2 border rounded" value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} />
                        <input type="text" placeholder="House Number" className="p-2 border rounded" value={newLocation.houseNumber} onChange={(e) => setNewLocation({ ...newLocation, houseNumber: e.target.value })} />
                        <input type="text" placeholder="Floor" className="p-2 border rounded" value={newLocation.floor} onChange={(e) => setNewLocation({ ...newLocation, floor: e.target.value })} />
                        <div className="flex gap-2">
                            <button className="bg-blue-500 px-4 py-2 text-white rounded" onClick={saveNewLocation}>Save</button>
                            <button className="bg-gray-500 px-4 py-2 text-white rounded" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerInfo;

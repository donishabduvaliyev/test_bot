import React, { useState } from "react";
import { motion } from "framer-motion";

function Cards({ section, cart, setCart, count, setCount }) {
    const [selectedFood, setSelectedFood] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);

    function handleOpenModal(item) {
        setSelectedFood(item);
        setSelectedSize(null);
        setSelectedToppings([]);
        setCount(1);
    }

    function handleCloseModal() {
        setSelectedFood(null);
    }

    function handleSizeChange(event) {
        const size = selectedFood.sizes.find(size => size.price === Number(event.target.value));
        setSelectedSize(size || null);
    }

    function handleToppingChange(event, topping) {
        if (event.target.checked) {
            setSelectedToppings([...selectedToppings, topping]);
        } else {
            setSelectedToppings(selectedToppings.filter(t => t.name !== topping.name));
        }
    }

    const basePrice = Number(selectedFood?.price || 0);
    const sizePrice = selectedSize ? Number(selectedSize.price) : 0;
    const toppingsPrice = selectedToppings.reduce((acc, topping) => acc + (topping.price || 0), 0);
    const totalPrice = (basePrice + sizePrice + toppingsPrice) * count;

    function addToCart() {
        if (selectedFood.sizes.length > 0 && !selectedSize) {
            alert("Please select a size.");
            return;
        }

        const newItem = {
            ...selectedFood,
            size: selectedSize,
            toppings: selectedToppings,
            quantity: count,
            totalPrice
        };

        setCart(prevCart => [...prevCart, newItem]);
        handleCloseModal();
    }

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {section.items && section.items.length > 0 ? (
                    section.items.map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center gap-4 w-full max-w-[250px]"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="w-full h-[150px] flex justify-center items-center">
                                <img src={item.image} className="w-full h-full object-cover rounded-lg" alt={item.name} />
                            </div>
                            <div className="text-center text-white">
                                <h1 className="text-lg font-semibold">{item.name}</h1>
                                <h2 className="text-sm text-gray-300">500 gr</h2>
                            </div>
                            <button
                                className="bg-sky-500 w-full rounded-lg py-2 text-white font-bold"
                                onClick={() => handleOpenModal(item)}
                            >
                                ${item.price}
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-white">No items available for this category.</p>
                )}
            </div>

            {selectedFood && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                    <div className="bg-gray-700 p-4 rounded-lg shadow-lg w-full max-w-md">
                        <button className="text-white text-lg" onClick={handleCloseModal}>✖</button>
                        <div className="w-full flex justify-center">
                            <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-[200px] object-cover rounded-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-white mt-2 text-center">{selectedFood.name}</h2>

                        {selectedFood.sizes.length > 0 && (
                            <div className="bg-[#5b656f] p-2 mt-4 rounded-lg text-white">
                                <span className="flex justify-between">
                                    <h1>Size</h1>
                                    <h2>Required</h2>
                                </span>
                                <div className="flex flex-col">
                                    {selectedFood.sizes.map((size, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input type="radio" name="pizza-size" value={size.price} onChange={handleSizeChange} />
                                            {size.name} (+${size.price.toFixed(2)})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedFood.toppings.length > 0 && (
                            <div className="text-white mt-4">
                                <span className="flex justify-between">
                                    <h1>Toppings</h1>
                                    <h1>Optional</h1>
                                </span>
                                <div className="bg-[#5b656f] p-2 rounded-lg">
                                    {selectedFood.toppings.map((topping, index) => (
                                        <div key={index} className="flex justify-between items-center gap-2">
                                            <input type="checkbox" checked={selectedToppings.some(t => t.name === topping.name)} onChange={(event) => handleToppingChange(event, topping)} />
                                            <label>{topping.name} (+${topping.price.toFixed(2)})</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4 text-white">
                            <div className="flex items-center space-x-2">
                                <button className="px-3 py-1 bg-green-500 rounded-lg" onClick={() => setCount(count + 1)}>+</button>
                                <h1>{count}</h1>
                                <button className="px-3 py-1 bg-red-500 rounded-lg" onClick={() => count > 1 && setCount(count - 1)}>-</button>
                            </div>
                            <button className="bg-[#30A3E6] px-4 py-2 rounded-lg text-white font-bold" onClick={addToCart}>
                                Add to Cart (${totalPrice.toFixed(2)})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cards;

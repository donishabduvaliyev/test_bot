import React, { useState } from "react";
import { motion } from "framer-motion";

function Cards({ section, cart, setCart, count, setCount }) {
    const [selectedFood, setSelectedFood] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [selectedSize, setSelectedSize] = useState()
    // Store full topping objects

    function handleOpenModal(item) {
        setSelectedFood(item);
        setSelectedOption("");
        setSelectedToppings([]);
        setCount(1);
    }

    function handleCloseModal() {
        setSelectedFood(null);
    }

    function handleSizeChange(event) {
        setSelectedOption(event.target.value);

        if (event.target.value !== '40000') {
            setSelectedSize(25)
            setSelectedOption(1)
        }
        else {
            setSelectedSize(35)
            setSelectedOption(40000)
        }


    }

    function handleToppingChange(event, topping) {
        const { checked } = event.target;

        if (checked) {
            setSelectedToppings([...selectedToppings, topping]);
        } else {
            setSelectedToppings(selectedToppings.filter((t) => t.name !== topping.name));
        }
    }




    const totalPrice =
        (Number(selectedFood?.price || 0) +
            Number(selectedOption) +
            selectedToppings.reduce((acc, topping) => acc + topping.price, 0)
        ) * count;



    function addToCart() {
        const newItem = {
            ...selectedFood,
            size: selectedSize,
            toppings: selectedToppings,
            quantity: count,
            totalPrice: (Number(selectedFood?.price || 0) +
                Number(selectedOption || 0) +
                selectedToppings.reduce((acc, topping) => acc + (topping.price || 0), 0)) * count
        };

        if (selectedOption != '') {
            setCart(prevCart => [...prevCart, newItem]);
            handleCloseModal();
        } else (
            alert('hajmini tanlang')
        )

    }



    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {section.items && section.items.length > 0 ? (
                    section.items.map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-700 px-2 py-3 rounded-lg shadow-lg flex flex-col gap-5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div>
                                <img src={item.image} className="w-[200px]" alt={item.name} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1>{item.name}</h1>
                                <h2>500 gr</h2>
                            </div>
                            <button
                                className="cursor-pointer bg-sky-500 w-full rounded-2xl"
                                onClick={() => handleOpenModal(item)}
                            >
                                {item.price}
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-white">No items available for this category.</p>
                )}

            </div>

            {/* Modal for choosing menu */}
            {selectedFood && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-700 p-4 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                        <button className="text-black" onClick={handleCloseModal}>
                            ✖
                        </button>
                        <div>
                            <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-40 object-cover mt-2" />
                            <h2 className="text-[22px] text-white">{selectedFood.name}</h2>
                        </div>

                        {/* Sticky size selector */}
                        <div >
                            <div className="sticky overflow-y-auto top-0 bg-[#5b656f] p-2">
                                <span className="flex justify-between">
                                    <h1>Size</h1>
                                    <h2>Required</h2>
                                </span>
                                <div className="flex flex-col">
                                    <label className="text-white">
                                        <input
                                            type="radio"
                                            name="pizza-size"
                                            value="0"
                                            onChange={handleSizeChange}
                                        />
                                        Small 25 cm
                                    </label>
                                    <label className="text-white">
                                        <input
                                            type="radio"
                                            name="pizza-size"
                                            value="40000"
                                            onChange={handleSizeChange}
                                        />
                                        Large 35 cm
                                    </label>
                                </div>
                            </div>

                            {/* Toppings */}
                            <div className="text-white mt-4">
                                <span className="flex justify-between">
                                    <h1>Toppings</h1>
                                    <h1>Optional</h1>
                                </span>
                                <div className="bg-[#5b656f] p-2">
                                    {selectedFood.toppings.map((topping, index) => (
                                        <div key={index} className="flex justify-between">
                                            <input
                                                type="checkbox"
                                                id={topping.name}
                                                checked={selectedToppings.some((t) => t.name === topping.name)} // Check if included
                                                onChange={(event) => handleToppingChange(event, topping)}
                                            />
                                            <div className="flex w-full justify-between">
                                                <label htmlFor={topping.name}> {topping.name}</label>
                                                <label htmlFor={topping.name}>{topping.price}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="text-black flex justify-between mt-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    className="px-2 bg-green-400 rounded text-white"
                                    onClick={() => setCount(count + 1)}
                                >
                                    +
                                </button>
                                <h1 className="text-white">{count}</h1>
                                <button
                                    className="px-2 bg-red-400 rounded text-white"
                                    onClick={() => count > 1 && setCount(count - 1)}
                                >
                                    -
                                </button>
                            </div>
                            <button className="bg-[#30A3E6] px-4 py-2 rounded text-white"
                                onClick={addToCart}

                            >
                                Add to Cart ${totalPrice.toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cards;

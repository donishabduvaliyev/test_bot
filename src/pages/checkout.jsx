import { useState } from "react";
import { useCart } from "../components/context";

function CheckTheCart() {
    const { cart, setCart , navigate } = useCart();

    const calculateTotalPrice = (price, quantity) => {
        return price * quantity;
    };

    function handleDelete(mahl) {
        if (mahl.quantity > 1) {
            const updateCart = cart.map((item) =>
                item.id === mahl.id
                    ? {
                          ...item,
                          quantity: item.quantity - 1,
                          totalPrice: calculateTotalPrice(item.price, item.quantity - 1),
                      }
                    : item
            );
            setCart(updateCart);
        } else {
            setCart((prevCart) => prevCart.filter((item) => item.id !== mahl.id));
        }
    }

    function addCount(count) {
        const updateCart = cart.map((item) =>
            item.id === count.id
                ? {
                      ...item,
                      quantity: item.quantity + 1,
                      totalPrice: calculateTotalPrice(item.price, item.quantity + 1),
                  }
                : item
        );
        setCart(updateCart);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-center text-white flex flex-col ">
<div>
    <button className="text-white text-[50px]" onClick={()=> navigate('/')}>back to store</button>
<h1>Check The Cart</h1>
    
    </div> 
               <div className="flex flex-col gap-3 items-center">
                {cart.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-700 px-2 py-3 rounded-lg shadow-lg flex flex-col justify-around text-white w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
                    >
                        <div className="flex justify-start gap-2">
                            <img
                                src={item.image}
                                alt=""
                                className="w-[100px] h-[70px] object-cover"
                            />
                            <span className="flex flex-col w-full">
                                <div className="flex justify-between">
                                    <h1>{item.name}</h1>
                                    <h1>{item.price}</h1>
                                </div>
                                <div className="text-gray-400 text-[10px]">
                                    <div className="flex justify-between text-[15px] text-gray-300">
                                        <p>Size</p>
                                        <p>{item.size}</p>
                                    </div>
                                    {item.toppings.map((topping, i) => (
                                        <div key={i} className="flex justify-between">
                                            <p>{topping.name}</p>
                                            <p>{topping.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </span>
                        </div>
                        <div className="text-start">
                            <div className="flex items-center space-x-1">
                                <button
                                    className="rounded bg-green-500 px-2"
                                    onClick={() => addCount(item)}
                                >
                                    +
                                </button>
                                <h1>{item.quantity}</h1>
                                <button
                                    className="rounded bg-red-500 px-2"
                                    onClick={() => handleDelete(item)}
                                >
                                    -
                                </button>
                            </div>
                        </div>
                        <div className="text-end">
                            <h2>Total: ${item.totalPrice.toFixed(2)}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <button className="text-white text-[50px] bg-[#229ED9] w-[400px] " onClick={()=> navigate('/adressInfo')}>Submit Order</button>
        </div>
    );
}

export default CheckTheCart;

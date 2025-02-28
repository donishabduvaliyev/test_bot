import { useEffect } from "react";
import { useCart } from "../components/context";

function CheckTheCart() {
    const { cart, setCart, navigate, orderPrice, setOrderPrice } = useCart();

    const calculateTotalPrice = (baseTotalPrice, quantity) => {
        return baseTotalPrice * quantity; // ✅ Multiplies total price including toppings
    };

    function handleDelete(item) {
        if (item.quantity > 1) {
            const updatedCart = cart.map((cartItem) =>
                cartItem.id === item.id
                    ? {
                        ...cartItem,
                        quantity: cartItem.quantity - 1,
                        totalPrice: calculateTotalPrice(item.totalPrice / item.quantity, item.quantity - 1), // ✅ Adjust total price based on per-item total price
                    }
                    : cartItem
            );
            setCart(updatedCart);
        } else {
            setCart(prevCart => prevCart.filter((cartItem) => cartItem.id !== item.id));
        }
    }

    function addCount(item) {
        const updatedCart = cart.map((cartItem) =>
            cartItem.id === item.id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + 1,
                    totalPrice: calculateTotalPrice(item.totalPrice / item.quantity, item.quantity + 1), // ✅ Uses per-item total price to correctly scale
                }
                : cartItem
        );
        setCart(updatedCart);
    }

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/');
        }


        if (cart.length > 0) {
            const totalOrderPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
            setOrderPrice(totalOrderPrice);
        }
    }, [cart, navigate]);



    return (
        <div className="min-h-screen bg-gray-900 text-center text-white flex flex-col">
            <div>
                <button className="text-white text-[50px]" onClick={() => navigate('/')}>Back to Store</button>
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
                                alt={item.name}
                                className="w-[100px] h-[70px] object-cover"
                            />
                            <span className="flex flex-col w-full">
                                <div className="flex justify-between">
                                    <h1>{item.name}</h1>
                                    <h1>${item.price}</h1>
                                </div>
                                <div className="text-gray-400 text-[10px]">
                                    <div className="flex justify-between text-[15px] text-gray-300">
                                        <p>Size</p>
                                        <p>{item.size}</p>
                                    </div>
                                    {item.toppings.map((topping, i) => (
                                        <div key={i} className="flex justify-between">
                                            <p>{topping.name}</p>
                                            <p>${topping.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </span>
                        </div>

                        <div className="text-start">
                            <div className="flex items-center space-x-1">
                                <button className="rounded bg-green-500 px-2" onClick={() => addCount(item)}>+</button>
                                <h1>{item.quantity}</h1>
                                <button className="rounded bg-red-500 px-2" onClick={() => handleDelete(item)}>-</button>
                            </div>
                        </div>

                        <div className="text-end">
                            <h2>Total: ${item.totalPrice.toFixed(2)}</h2> {/* ✅ Correctly updates totalPrice */}
                        </div>
                    </div>
                ))}
            </div>

            <button className="text-white text-[50px] bg-[#229ED9] w-[400px]" onClick={() => navigate('/adressInfo')}> {orderPrice} lik buyurtma berish</button>
        </div>
    );
}

export default CheckTheCart;

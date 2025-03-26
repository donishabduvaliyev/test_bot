import { useEffect } from "react";
import { useCart } from "../components/context";

function CheckTheCart() {
    const { cart, setCart, navigate, OrderPrice, setOrderPrice } = useCart();

    // Calculates total price including base price, size, toppings & quantity
    const calculateTotalPrice = (item) => {
        const basePrice = item.price;
        const sizePrice = item.size?.price || 0;
        const toppingsTotal = item.toppings?.reduce((acc, topping) => acc + (topping.price || 0), 0) || 0;
        return (basePrice + sizePrice + toppingsTotal) * item.quantity;
    };

    function handleDelete(item) {
        if (item.quantity > 1) {
            const updatedCart = cart.map((cartItem) =>
                cartItem._id === item._id
                    ? {
                        ...cartItem,
                        quantity: cartItem.quantity - 1,
                        totalPrice: calculateTotalPrice({ ...item, quantity: item.quantity - 1 }),
                    }
                    : cartItem
            );
            setCart(updatedCart);
        } else {
            setCart(prevCart => prevCart.filter((cartItem) => cartItem.uniqueId !== item.uniqueId));
        }
    }

    function addCount(item) {
        const updatedCart = cart.map((cartItem) =>
            cartItem._id === item._id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + 1,
                    totalPrice: calculateTotalPrice({ ...item, quantity: item.quantity + 1 }),
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
        <div className="min-h-screen bg-gray-900 text-center text-white flex flex-col relative pb-24">
            <div>
                <button className="text-white text-[30px] mb-4 bg-gray-700 px-4 py-2 rounded-lg" onClick={() => navigate('/')}>Back to Store</button>
                <h1 className="text-3xl font-bold mb-6">Check The Cart</h1>
            </div>



            <div className="flex flex-col gap-3 items-center px-4">
                {cart.map((item, index) => (
                    <div
                        key={item._id}
                        className="bg-gray-700 px-4 py-3 rounded-lg shadow-lg flex flex-col justify-around text-white w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
                    >
                        <div className="flex justify-start gap-3">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-[80px] h-[60px] sm:w-[100px] sm:h-[70px] object-cover rounded"
                            />
                            <span className="flex flex-col w-full">
                                <div className="flex justify-between">
                                    <h1 className="text-lg font-semibold">{item.name}</h1>
                                    <h1 className="text-lg">${(item.price + (item.size?.price || 0)).toFixed(2)}</h1>
                                </div>
                                <div className="text-gray-400 text-[12px] sm:text-[10px]">
                                    {item.size && (
                                        <div className="flex justify-between text-[14px] sm:text-[15px] text-gray-300">
                                            <p>Size</p>
                                            <p>{item.size.name} (+${item.size.price.toFixed(2)})</p>
                                        </div>
                                    )}
                                    {item.toppings?.map((topping, i) => (
                                        <div key={i} className="flex justify-between">
                                            <p>{topping.name}</p>
                                            <p>${topping.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </span>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center space-x-2">
                                <button className="rounded bg-green-500 px-3 py-1 text-lg font-bold" onClick={() => addCount(item)}>+</button>
                                <h1 className="text-lg">{item.quantity}</h1>
                                <button className="rounded bg-red-500 px-3 py-1 text-lg font-bold" onClick={() => handleDelete(item)}>-</button>
                            </div>
                            <h2 className="text-lg font-semibold">Total: ${item.totalPrice.toFixed(2)}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <button className="text-white text-[20px] sm:text-[30px] bg-[#229ED9] w-full max-w-[350px] fixed bottom-0 left-1/2 transform -translate-x-1/2 py-3 rounded-lg text-lg font-semibold"
                onClick={() => navigate('/adressInfo')}>

                {OrderPrice} - UZS lik buyurtma berish
            </button>
        </div>
    );
}

export default CheckTheCart;
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const cartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [OrderPrice, setOrderPrice] = useState();
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true); 
                const response = await axios.get("https://backend-xzwz.onrender.com/api/products");

                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                    console.log(response.data);
                } else {
                    console.error("❌ Unexpected API response format:", response.data);
                }
            } catch (error) {
                console.error("❌ Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <cartContext.Provider value={{
            cart,
            setCart,
            navigate,
            products,
            setProducts, // ✅ Include setProducts so you can update it in other components
            OrderPrice,
            setOrderPrice,
            loading // ✅ Provide loading state
        }}>
            {children}
        </cartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(cartContext);
};

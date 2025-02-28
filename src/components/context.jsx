import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const cartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const navigate = useNavigate()


    const [products, setProducts] = useState([]);

    const [OrderPrice, setOrderPrice] = useState()









    useEffect(() => {

        axios.get("https://backend-xzwz.onrender.com/api/products")
            .then((response) => {

                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                    console.log(response.data);


                    // ✅ Only update state if it's an array
                } else {
                    console.error("❌ Unexpected API response format:", response.data);
                }
            })
            .catch((error) => {
                console.error("❌ Error fetching data:", error);
            });
    }, []);






    return (
        <cartContext.Provider value={{ cart, setCart, navigate, products, OrderPrice, setOrderPrice }} >
            {children}
        </cartContext.Provider>
    )

}




export const useCart = () => {
    return useContext(cartContext);
};
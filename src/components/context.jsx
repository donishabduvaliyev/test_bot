import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const cartContext = createContext()

export const CartProvider = ({children}) =>{
const [cart ,setCart] = useState([])
const navigate = useNavigate()


return (
    <cartContext.Provider value={{cart, setCart , navigate}} >
        {children}
    </cartContext.Provider>
)

}




export const useCart = () => {
    return useContext(cartContext);
  };
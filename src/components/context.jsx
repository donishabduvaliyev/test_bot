import { createContext, useContext, useState } from "react";

const cartContext = createContext()

export const CartProvider = ({children}) =>{
const [cart ,setCart] = useState([])



return (
    <cartContext.Provider value={{cart, setCart}} >
        {children}
    </cartContext.Provider>
)

}




export const useCart = () => {
    return useContext(createContext);
  };
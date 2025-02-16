import { createContext, useContext, useState } from "react";

const createContext = createContext()

export const CartProvider = ({children}) =>{
const [cart ,setCart] = useState([])



return (
    <createContext.Provider value={{cart, setCart}} >
        {children}
    </createContext.Provider>
)

}




export const useCart = () => {
    return useContext(createContext);
  };
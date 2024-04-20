'use client';
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast, {Toaster} from "react-hot-toast";

export const cartContext = createContext({});

export function calculateTotalPrice(cartItem) {
    let price = cartItem.itemBasePrice;
    if (cartItem.size) {
        price += cartItem.size.price;
    }
    if(cartItem.extras?.length > 0){
        for (const extra of cartItem.extras) {
            price += extra.price;
        }
    }
    return price;
}


export function AppProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const localStorage = typeof window !== 'undefined' ? window.localStorage : null;

    useEffect(() => {
        if(localStorage && localStorage.getItem('cart')){
            setCartItems(JSON.parse(localStorage.getItem('cart')));
        }
    }, []);
    
    function saveCartItemsToStorage(cartItems){
       if(localStorage){
        localStorage.setItem('cart', JSON.stringify(cartItems));
       } 
    }

    function clearCart(){
        setCartItems([]);
        saveCartItemsToStorage([]);
    }

    function removeFromCart(indexToRemove) {
        setCartItems(prevItems => {
            const newCartItems = prevItems.filter((value,index) => index !== indexToRemove);
            saveCartItemsToStorage(newCartItems);
            return newCartItems;
        })
        toast.success('Item Removed');
    }

    function addToCart(item, size=null, extras=[]) {
        setCartItems(prevItems => {
            const cartItem = {...item,size,extras}
            const newItems = [...prevItems, cartItem]; 
            saveCartItemsToStorage(newItems);   
            return newItems;
        })
    }

    
    return (
        <SessionProvider>
            <Toaster position="top-center" />
            <cartContext.Provider value={{
                cartItems, setCartItems, addToCart, clearCart, removeFromCart, calculateTotalPrice
            }}>
                {children}
            </cartContext.Provider>
        </SessionProvider>
    );
}
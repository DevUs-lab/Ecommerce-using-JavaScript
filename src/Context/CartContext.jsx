import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    const [deliveryCharge, setDeliveryCharge] = useState(null);

    // 🔹 FETCH SETTINGS
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "globalSettings", "storeInfo");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDeliveryCharge(docSnap.data().deliveryCharge || 0);
                }
            } catch (error) {
                console.error("Failed to fetch delivery charge", error);
            }
        };
        fetchSettings();
    }, []);

    // 🔹 SAVE TO LOCAL STORAGE
    // useEffect(() => {
    //     localStorage.setItem("cart", JSON.stringify(cartItems));
    // }, [cartItems]);

    useEffect(() => {
        if (cartItems) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems]);


    // const addToCart = (product, quantity) => {
    //     setCartItems(prev => {
    //         const existing = prev.find(item => item.id === product.id);
    //         if (existing) {
    //             return prev.map(item =>
    //                 item.id === product.id
    //                     ? { ...item, quantity: item.quantity + quantity }
    //                     : item
    //             );
    //         }
    //         return [...prev, { ...product, quantity }];
    //     });
    // };
    const addToCart = (product, quantity) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);

            if (existing) {
                const newQty = existing.quantity + quantity;

                if (newQty > product.stock) {
                    return prev.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: product.stock }
                            : item
                    );
                }

                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQty }
                        : item
                );
            }

            return [
                ...prev,
                {
                    ...product,
                    quantity: quantity > product.stock ? product.stock : quantity
                }
            ];
        });
    };


    const increment = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.quantity < item.stock
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decrement = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    const cartCount = cartItems.reduce((t, i) => t + i.quantity, 0);

    const cartTotal = cartItems.reduce(
        (t, i) => t + i.quantity * i.sellPrice,
        0
    );

    const grandTotal = cartTotal + (deliveryCharge || 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            increment,
            decrement,
            removeFromCart,
            clearCart,
            cartCount,
            cartTotal,
            deliveryCharge,
            setDeliveryCharge, // Expose setter if needed, but better to fetch from DB
            grandTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

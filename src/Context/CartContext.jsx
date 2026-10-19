import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem("cart");
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            // Corrupted/invalid JSON in localStorage should not crash the app
            return [];
        }
    });

    const [deliveryCharge, setDeliveryCharge] = useState(null);
    const [onlinePaymentDiscount, setOnlinePaymentDiscount] = useState(0);

    // 🔹 FETCH SETTINGS
    useEffect(() => {
        // When Firebase env vars are missing the app shows a setup notice and
        // `db` stays null — skip the fetch instead of throwing.
        if (!db) return;

        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "globalSettings", "storeInfo");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDeliveryCharge(docSnap.data().deliveryCharge ?? 0);
                    setOnlinePaymentDiscount(docSnap.data().onlinePaymentDiscount ?? 0);
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
        const requested = Math.max(1, Number(quantity) || 1);
        const stock = Number(product.stock) || 0;
        if (stock <= 0) return; // never add an out-of-stock product

        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);

            if (existing) {
                const newQty = Math.min((Number(existing.quantity) || 0) + requested, stock);

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
                    quantity: Math.min(requested, stock)
                }
            ];
        });
    };


    const increment = (id) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id !== id) return item;
                const stock = Number(item.stock) || 0;
                const qty = Number(item.quantity) || 0;
                if (qty >= stock) return item;
                return { ...item, quantity: qty + 1 };
            })
        );
    };

    const decrement = (id) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id !== id) return item;
                const qty = Number(item.quantity) || 0;
                if (qty <= 1) return item;
                return { ...item, quantity: qty - 1 };
            })
        );
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    const cartCount = cartItems.reduce((t, i) => t + (Number(i.quantity) || 0), 0);

    const cartTotal = cartItems.reduce(
        (t, i) => t + (Number(i.quantity) || 0) * (Number(i.sellPrice) || 0),
        0
    );

    const grandTotal = cartTotal + (Number(deliveryCharge) || 0);

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
            grandTotal,
            onlinePaymentDiscount
        }}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider belong together
export const useCart = () => useContext(CartContext);

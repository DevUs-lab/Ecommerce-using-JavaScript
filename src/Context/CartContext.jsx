import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    // 🔹 SAVE TO LOCAL STORAGE
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
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

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            increment,
            decrement,
            removeFromCart,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

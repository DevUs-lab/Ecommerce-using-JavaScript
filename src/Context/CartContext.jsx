import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// import { auth, db } from '../firebase/config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [user, setUser] = useState(null);

    // persist locally whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Subscribe to user's cart in Firestore when signed in
    useEffect(() => {
        let unsubscribe = null;
        const authUnsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);

            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }

            if (u) {
                const cartDocRef = doc(db, 'carts', u.uid);
                unsubscribe = onSnapshot(cartDocRef, (snap) => {
                    if (snap.exists()) {
                        const data = snap.data();
                        setCart(Array.isArray(data.items) ? data.items : []);
                    } else {
                        setCart([]);
                    }
                });
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
            authUnsub();
        };
    }, []);

    // write cart to Firestore when user is present
    const writeCartToFirestore = async (newCart) => {
        if (!user) return;
        try {
            const cartDocRef = doc(db, 'carts', user.uid);
            await setDoc(cartDocRef, { items: newCart }, { merge: true });
        } catch (err) {
            console.error('Failed to write cart to firestore', err);
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            let next;
            if (existingItem) {
                next = prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                next = [...prevCart, { ...product, quantity: 1 }];
            }
            // optimistic write
            writeCartToFirestore(next);
            return next;
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const next = prevCart.filter((item) => item.id !== productId);
            writeCartToFirestore(next);
            return next;
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) => {
            const next = prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            );
            writeCartToFirestore(next);
            return next;
        });
    };

    const clearCart = () => {
        setCart([]);
        writeCartToFirestore([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, user }}>
            {children}
        </CartContext.Provider>
    );
};
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from '../firebase/config';


export const getProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

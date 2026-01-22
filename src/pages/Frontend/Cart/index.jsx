import { collection, addDoc, serverTimestamp, doc, updateDoc, increment as firestoreIncrement } from "firebase/firestore";
import { useEffect } from "react";
import React, { useState } from "react";
import { useCart } from "../../../Context/CartContext";
import Header from "../../../Components/Header";
import { db } from "../../../firebase/config";

const Cart = () => {
    const {
        cartItems,
        increment: incrementCartItem,
        decrement,
        removeFromCart,
        clearCart,
        cartTotal,
        deliveryCharge,
        grandTotal,
    } = useCart();

    const [fetchingDeliveryCharge, setFetchingDeliveryCharge] = useState(true);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

    useEffect(() => {
        if (deliveryCharge !== null) {
            setFetchingDeliveryCharge(false);
        }
    }, [deliveryCharge]);



    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsOrderPlaced(true);

        // Get form data
        const name = e.target.name.value;
        const address = e.target.address.value;
        const phone = e.target.phone.value;
        // const paymentMethod = e.target.paymentMethod.value; // Already using state

        if (!name || !address || !phone) {
            alert("Please fill all fields");
            setIsOrderPlaced(false);
            return;
        }

        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                alert(`Not enough stock for ${item.productName}`);
                setIsOrderPlaced(false);
                return;
            }
        }


        try {
            const orderRef = await addDoc(collection(db, "orders"), {
                userId: "guest", // replace with auth user if logged in
                customerName: name,
                address,
                phone,
                items: cartItems,
                total: cartTotal,
                deliveryCharge,
                grandTotal,
                paymentMethod,
                status: "Pending",
                createdAt: serverTimestamp(),
            });

            // Iterate through cartItems and update stock
            for (const item of cartItems) {
                const productRef = doc(db, "products", item.id);
                await updateDoc(productRef, {
                    stock: firestoreIncrement(-item.quantity)
                });
            }

            let successMsg = "Order placed successfully! Order ID: " + orderRef.id;
            if (paymentMethod === "EasyPaisa" || paymentMethod === "JazzCash") {
                successMsg += "\n\nPlease send the amount to 03190609041 and WhatsApp the proof to the same number for confirmation.";
            } else if (paymentMethod === "Bank Transfer") {
                successMsg += "\n\nPlease transfer the amount to Meezan Bank (Acc: 33020112425464) and WhatsApp the proof to 03190609041.";
            }

            alert(successMsg);

            clearCart(); // clear cart after order
        } catch (error) {
            console.error("Failed to place order:", error);
            alert("Failed to place order. Try again.");
        }
        setIsOrderPlaced(false);
    };


    if (cartItems.length === 0) {
        return (
            <>
                <Header />
                <h3 className="text-center mt-5">Your cart is empty 🛒</h3>
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="container my-5">
                <h2 className="mb-4 text-center text-primary">Your Cart</h2>

                {/* Cart Items */}
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="card mb-3 shadow-sm border-0 p-3"
                    >
                        <div className="row align-items-center">
                            {/* Image & Name */}
                            <div className="col-12 col-md-5 d-flex align-items-center gap-3 mb-3 mb-md-0">
                                <img
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    className="img-fluid rounded"
                                    style={{ maxWidth: "100px", objectFit: "cover" }}
                                />
                                <div>
                                    <h5 className="mb-1">{item.productName}</h5>
                                    <p className="text-muted mb-0">Price: Rs {item.sellPrice}</p>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="col-6 col-md-4 mb-3 mb-md-0 d-flex justify-content-start justify-content-md-center">
                                <div className="btn-group w-75 w-md-50" role="group">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => decrement(item.id)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span
                                        className="btn btn-outline-secondary disabled fw-bold text-dark"
                                        style={{
                                            width: "50px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => incrementCartItem(item.id)}
                                        disabled={item.quantity >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="col-4 col-md-2 text-center fw-bold mb-3 mb-md-0">
                                Rs {item.sellPrice * item.quantity}
                            </div>

                            <div className="col-2 col-md-1 mb-3 mb-md-0 text-end">
                                <button
                                    className="btn btn-transparent btn-sm rounded-circle p-2"
                                    onClick={() => removeFromCart(item.id)}
                                    title="Remove Item"
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Cart Summary */}
                <div className="row py-4 align-items-center bg-light rounded shadow-sm p-3">
                    <div className="col-12 col-md-6 mb-3 mb-md-0 d-flex justify-content-start">
                        <button
                            className="btn btn-outline-danger"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>
                    </div>
                    <div className="col-12 col-md-6 text-md-end">
                        <p className="mb-1">Subtotal: Rs {cartTotal}</p>
                        <div className="mb-1"><p>
                            Delivery Charge: Rs {fetchingDeliveryCharge ? "wait..." : deliveryCharge}
                        </p>
                        </div>
                        <h4 className="fw-bold">Grand Total: Rs {fetchingDeliveryCharge ? "wait..." : grandTotal}</h4>
                    </div>
                </div>

                {/* Checkout Form */}

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow-sm p-4">
                            <h4 className="mb-4 text-center text-primary">Checkout</h4>
                            <form onSubmit={handlePlaceOrder}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your name"
                                        name="name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your address"
                                        name="address"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your phone number"
                                        name="phone"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="paymentMethod" className="form-label">
                                        Select Payment Method
                                    </label>
                                    <select
                                        className="form-control"
                                        id="paymentMethod"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="Cash on Delivery">Cash on Delivery</option>
                                        <option value="EasyPaisa">EasyPaisa</option>
                                        <option value="JazzCash">JazzCash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </div>

                                {/* Payment Instructions Alert */}
                                {(paymentMethod === "EasyPaisa" || paymentMethod === "JazzCash") && (
                                    <div className="alert alert-info">
                                        <h5>Payment Instructions</h5>
                                        <p className="mb-1">Please send <strong>Rs {grandTotal}</strong> to the followig number:</p>
                                        <p className="fs-5 fw-bold mb-2">03190609041</p>
                                        <p className="mb-0">Once sent, please <strong>WhatsApp</strong> the screenshot/proof to the same number (03190609041) for order confirmation.</p>
                                    </div>
                                )}

                                {paymentMethod === "Bank Transfer" && (
                                    <div className="alert alert-info">
                                        <h5>Bank Transfer Details (Meezan Bank)</h5>
                                        <p className="mb-1">Please transfer <strong>Rs {grandTotal}</strong> to the following account:</p>
                                        <ul className="list-unstyled">
                                            <li><strong>Account No:</strong> 33020112425464</li>
                                            <li><strong>IBAN:</strong> PK10MEZN0033020112425464</li>
                                        </ul>
                                        <p className="mb-0">Once transferred, please <strong>WhatsApp</strong> the proof to 03190609041 for order confirmation.</p>
                                    </div>
                                )}


                                <button className="btn btn-primary w-100 mt-3" type="submit" disabled={isOrderPlaced}>
                                    {isOrderPlaced ? "Placing Order..." : "Place Order"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;

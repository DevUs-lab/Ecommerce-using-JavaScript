import { collection, serverTimestamp, doc, increment as firestoreIncrement, writeBatch } from "firebase/firestore";
import { useEffect } from "react";
import React, { useState } from "react";
import { useCart } from "../../../Context/CartContext";
import Header from "../../../Components/Header";
import { db } from "../../../firebase/config";
import { AntdMess } from "../../../Components/Antd";

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
        onlinePaymentDiscount,
    } = useCart();

    const [fetchingDeliveryCharge, setFetchingDeliveryCharge] = useState(true);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

    // useEffect(() => {
    //     if (deliveryCharge !== null) {
    //         setFetchingDeliveryCharge(false);
    //     }
    // }, [deliveryCharge]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFetchingDeliveryCharge(false);
        }, 5000); // Fallback after 5 seconds

        if (deliveryCharge !== null && deliveryCharge !== undefined) {
            setFetchingDeliveryCharge(false);
            clearTimeout(timer);
        }

        return () => clearTimeout(timer);
    }, [deliveryCharge]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsOrderPlaced(true);

        // Get form data
        const name = e.target.name.value;
        const address = e.target.address.value;
        const phone = e.target.phone.value;

        if (!name || !address || !phone) {
            AntdMess({ type: "info", messageText: "Please fill all fields" });
            setIsOrderPlaced(false);
            return;
        }

        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            AntdMess({ type: "info", messageText: "Please enter a valid 10-11 digit phone number" });
            setIsOrderPlaced(false);
            return;
        }

        for (const item of cartItems) {
            if (!item.stock || item.quantity > item.stock) {
                AntdMess({
                    type: "info",
                    messageText: `Not enough stock for ${item.productName}. Available: ${item.stock || 0}`
                });
                setIsOrderPlaced(false);
                return;
            }
        }

        const discount = (paymentMethod === "EasyPaisa" || paymentMethod === "JazzCash" || paymentMethod === "Bank Transfer") ? (onlinePaymentDiscount || 0) : 0;
        const finalGrandTotal = grandTotal - discount;

        try {
            const batch = writeBatch(db);
            const orderRef = doc(collection(db, "orders"));

            batch.set(orderRef, {
                userId: "guest",
                customerName: name,
                address,
                phone,
                items: cartItems,
                total: cartTotal,
                deliveryCharge,
                discount,
                grandTotal: finalGrandTotal,
                paymentMethod,
                status: "pending",
                createdAt: serverTimestamp(),
            });

            // Update stock in same batch
            cartItems.forEach(item => {
                const productRef = doc(db, "products", item.id);
                batch.update(productRef, {
                    stock: firestoreIncrement(-item.quantity)
                });
            });

            await batch.commit();

            let successMsg = `Order placed successfully! Order ID: ${orderRef.id}`;
            if (paymentMethod === "EasyPaisa" || paymentMethod === "JazzCash") {
                successMsg += `\n\nPlease send Rs ${finalGrandTotal} to 03190609041 and WhatsApp the proof for confirmation.`;
            } else if (paymentMethod === "Bank Transfer") {
                successMsg += `\n\nPlease transfer Rs ${finalGrandTotal} to Meezan Bank (Acc: 33020112425464) and WhatsApp the proof to 03190609041 for confirmation.`;
            }

            AntdMess({ type: "success", messageText: successMsg });
            clearCart();
        } catch (error) {
            console.error("Failed to place order:", error);
            AntdMess({ type: "error", messageText: "Failed to place order. Try again." });
        } finally {
            setIsOrderPlaced(false);
        }
    };


    if (cartItems.length === 0) {
        return (
            <>
                <Header />
                <h3 className="text-center mt-5">Your cart is empty 🛒</h3>
            </>
        );
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        AntdMess({ type: "success", messageText: "Copied to clipboard!" });
    };

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
                        {onlinePaymentDiscount > 0 && (
                            <p className="text-success fw-bold mb-1">
                                <span role="img" aria-label="gift">🎁</span> Pay online now to get Rs {onlinePaymentDiscount} discount!
                            </p>
                        )}
                        <p className="mb-1">Subtotal: Rs {cartTotal}</p>
                        <div className="mb-1">
                            <p>
                                Delivery Charge: Rs {fetchingDeliveryCharge ? "wait..." : deliveryCharge}
                            </p>
                        </div>
                        {(paymentMethod === "EasyPaisa" || paymentMethod === "JazzCash" || paymentMethod === "Bank Transfer") && (onlinePaymentDiscount > 0) && (
                            <p className="mb-1 text-success fw-bold">Discount: - Rs {onlinePaymentDiscount}</p>
                        )}
                        <h4 className="fw-bold">Grand Total: Rs {fetchingDeliveryCharge ? "Calculating..." : (paymentMethod === "EasyPaisa" || paymentMethod === "JazzCash" || paymentMethod === "Bank Transfer" ? grandTotal - onlinePaymentDiscount : grandTotal)}</h4>
                    </div>
                </div>

                {/* Checkout Form */}

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow-sm p-4">
                            <h4 className="mb-4 text-center text-primary">Checkout</h4>
                            <form onSubmit={handlePlaceOrder}>
                                <div className="mb-3 input-group">
                                    <span className="input-group-text">
                                        <i className="fa-solid fa-user"></i>
                                    </span>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your name"
                                        name="name"
                                    />
                                </div>
                                <div className="mb-3 input-group">
                                    <span className="input-group-text">
                                        <i className="fa-solid fa-phone"></i>
                                    </span>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your address"
                                        name="address"
                                    />
                                </div>
                                <div className="mb-3 input-group">
                                    <span className="input-group-text">
                                        <i className="fa-solid fa-phone"></i>
                                    </span>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        placeholder={`Enter your phone number`}
                                        name="phone"

                                    />
                                </div>
                                <div className="mb-3">
                                    {/* <label htmlFor="paymentMethod" className="form-label">
                                        Select Payment Method
                                    </label> */}

                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fa-solid fa-money-bill"></i>
                                        </span>

                                        <select
                                            className="form-select"
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
                                </div>


                                {/* Payment Instructions Alert */}
                                {(paymentMethod === "EasyPaisa" || paymentMethod === "JazzCash") && (
                                    <div className="alert alert-info">
                                        <h5>Payment Instructions</h5>
                                        <p className="mb-2 text-primary fw-bold">
                                            <span role="img" aria-label="discount">🎉</span> You get Rs {onlinePaymentDiscount} discount for paying online!
                                        </p>
                                        <p className="mb-1">Please transfer <strong>Rs {grandTotal - onlinePaymentDiscount}</strong> to the following account:</p>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="fs-5 fw-bold">03190609041</span>
                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0"
                                                onClick={() => copyToClipboard("03190609041")}
                                            >
                                                <i className="fa-regular fa-copy"></i>
                                            </button>
                                        </div>

                                        <p className="mb-0">
                                            Once sent, please <strong>WhatsApp</strong> the screenshot/proof to
                                            <span className="mx-1 fw-bold">03190609041</span>
                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0"
                                                onClick={() => copyToClipboard("03190609041")}
                                            >
                                                <i className="fa-regular fa-copy"></i>
                                            </button>
                                        </p>
                                    </div>
                                )}


                                {paymentMethod === "Bank Transfer" && (
                                    <div className="alert alert-info">
                                        <h5>Bank Transfer Details (Meezan Bank)</h5>
                                        <p className="mb-1">Please transfer <strong>Rs {grandTotal - onlinePaymentDiscount}</strong> to the following account:</p>
                                        <p className="mb-2 text-primary fw-bold">
                                            <span role="img" aria-label="discount">🎉</span> You get Rs {onlinePaymentDiscount} discount for paying online!
                                        </p>
                                        <ul className="list-unstyled">
                                            <li className="mb-2 d-flex align-items-center gap-2">
                                                <strong>Account No:</strong> 33020112425464
                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0" onClick={() => copyToClipboard("33020112425464")}><i className="fa-regular fa-copy"></i></button>
                                            </li>
                                            <li className="mb-2 d-flex align-items-center gap-2">
                                                <strong>IBAN:</strong> PK10MEZN0033020112425464
                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0" onClick={() => copyToClipboard("PK10MEZN0033020112425464")}><i className="fa-regular fa-copy"></i></button>
                                            </li>
                                        </ul>
                                        <p className="mb-0">
                                            Once transferred, please <strong>WhatsApp</strong> the proof to
                                            <span className="mx-1 fw-bold">03190609041</span>
                                            <button
                                                type="button"
                                                className="btn btn-sm p-0 mx-1 btn-outline-secondary"
                                                onClick={() => copyToClipboard("03190609041")}
                                            >
                                                <i className="fa-regular fa-copy mx-2"></i>
                                            </button>
                                            for order confirmation.
                                        </p>
                                    </div>
                                )}


                                <button
                                    className="btn btn-primary w-100 mt-3"
                                    type="submit"
                                    disabled={isOrderPlaced || fetchingDeliveryCharge}
                                >
                                    {isOrderPlaced ? "Placing Order..." :
                                        fetchingDeliveryCharge ? "Calculating Charges..." : "Place Order"}
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="col-12 my-5">
                        <p className="mb-0 flex-nowrap">
                            For product details, delivery, order cancellation, or return policy, contact us on{": "}
                            <a
                                href="https://wa.me/923190609041"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fw-bold text-success text-decoration-none text-nowrap"
                            >

                                <i className="fa-brands fa-whatsapp me-1"></i> WhatsApp (0319-0609041)
                            </a>
                        </p>
                    </div>



                </div >
            </div >
        </>
    );
};

export default Cart;

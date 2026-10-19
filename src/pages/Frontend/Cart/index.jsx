import { collection, serverTimestamp, doc, increment as firestoreIncrement, runTransaction } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../Context/CartContext";
import Navbar from "../../../Components/Header/Navbar";
import Footer from "../../../Components/Footer/Footer";
import Seo from "../../../Components/Seo";
import { db } from "../../../firebase/config";
import { AntdMess } from "../../../Components/Antd";
import { formatPrice } from "../../../utils/format";
import { optimizedImageUrl } from "../../../utils/imageOptimization";

// Thrown inside the checkout transaction when someone tries to buy more
// than what is actually left in stock.
class InsufficientStockError extends Error {
    constructor(productName, available) {
        super(`Not enough stock for ${productName}`);
        this.name = "InsufficientStockError";
        this.productName = productName;
        this.available = available;
    }
}

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
        if (deliveryCharge !== null && deliveryCharge !== undefined) {
            setFetchingDeliveryCharge(false);
            return;
        }

        // Fallback: stop showing "calculating" after 5 s even if Firestore is slow
        const timer = setTimeout(() => {
            setFetchingDeliveryCharge(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [deliveryCharge]);

    const isOnlinePayment =
        paymentMethod === "EasyPaisa" ||
        paymentMethod === "JazzCash" ||
        paymentMethod === "Bank Transfer";
    const safeDeliveryCharge = Number(deliveryCharge) || 0;
    // Discount the store offers for paying online (capped at the cart total).
    const onlineDiscountValue = Math.min(Number(onlinePaymentDiscount) || 0, grandTotal);
    const discountAmount = isOnlinePayment ? onlineDiscountValue : 0;
    const finalGrandTotal = Math.max(0, grandTotal - discountAmount);

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
            const available = Number(item.stock) || 0;
            if (available <= 0 || Number(item.quantity) > available) {
                AntdMess({
                    type: "info",
                    messageText: `Not enough stock for ${item.productName}. Available: ${available}`
                });
                setIsOrderPlaced(false);
                return;
            }
        }

        const discount = isOnlinePayment
            ? Math.min(Number(onlinePaymentDiscount) || 0, grandTotal)
            : 0;
        const orderGrandTotal = Math.max(0, grandTotal - discount);

        try {
            // A transaction re-reads stock inside Firestore, so two people
            // buying the last unit at the same time can never oversell it.
            const orderId = await runTransaction(db, async (transaction) => {
                const productRefs = cartItems.map(item => doc(db, "products", item.id));
                const productSnaps = await Promise.all(
                    productRefs.map(ref => transaction.get(ref))
                );

                cartItems.forEach((item, index) => {
                    const snap = productSnaps[index];
                    const available = snap.exists() ? (snap.data().stock ?? 0) : 0;
                    if (!snap.exists() || item.quantity > available) {
                        throw new InsufficientStockError(item.productName, available);
                    }
                });

                const orderRef = doc(collection(db, "orders"));

                transaction.set(orderRef, {
                    userId: "guest",
                    customerName: name,
                    address,
                    phone,
                    items: cartItems,
                    total: cartTotal,
                    deliveryCharge: safeDeliveryCharge,
                    discount,
                    grandTotal: orderGrandTotal,
                    paymentMethod,
                    status: "pending",
                    createdAt: serverTimestamp(),
                });

                // Update stock in the same transaction
                productRefs.forEach((productRef, index) => {
                    transaction.update(productRef, {
                        stock: firestoreIncrement(-cartItems[index].quantity)
                    });
                });

                return orderRef.id;
            });

            let successMsg = (
                <span>Order placed successfully! Order ID: {orderId}</span>
            );
            if (paymentMethod === "EasyPaisa" || paymentMethod === "JazzCash") {
                successMsg = (
                    <span>
                        Order placed successfully! Order ID: {orderId}
                        <br />
                        <br />
                        Please send {formatPrice(orderGrandTotal)} to 03190609041
                        and WhatsApp the screenshot for confirmation.
                    </span>
                );
            } else if (paymentMethod === "Bank Transfer") {
                successMsg = (
                    <span>
                        Order placed successfully! Order ID: {orderId}
                        <br />
                        <br />
                        Please transfer {formatPrice(orderGrandTotal)} to Meezan
                        Bank (Acc: 33020112425464) and WhatsApp the proof to
                        03190609041 for confirmation.
                    </span>
                );
            }

            AntdMess({ type: "success", messageText: successMsg });
            clearCart();
        } catch (error) {
            if (error instanceof InsufficientStockError) {
                AntdMess({
                    type: "info",
                    messageText: `Not enough stock for ${error.productName}. Available: ${error.available}`
                });
            } else {
                console.error("Failed to place order:", error);
                AntdMess({ type: "error", messageText: "Failed to place order. Try again." });
            }
        } finally {
            setIsOrderPlaced(false);
        }
    };


    if (cartItems.length === 0) {
        return (
            <>
                <Seo title="Your Cart" path="/cart" robots="noindex, nofollow" />
                <Navbar />

                <div className="container my-5 text-center py-5">
                    <div style={{ fontSize: "3rem" }} aria-hidden="true">🛒</div>
                    <h1 className="h4 mb-3">Your cart is empty</h1>
                    <p className="text-muted mb-4">
                        Looks like you haven't added anything yet.
                    </p>
                    <Link to="/products" className="btn btn-primary px-4">
                        Start Shopping
                    </Link>
                </div>

                <Footer />

                {/* WhatsApp CTA */}
                <div className="bg-light border-top py-3">
                    <p className="mb-0 text-center px-2">
                        For product details, delivery, order cancellation, or return policy, contact us on{" "}
                        <a
                            href="https://wa.me/923190609041"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fw-bold text-success text-decoration-none text-nowrap"
                        >
                            <i className="fa-brands fa-whatsapp me-1"></i>
                            WhatsApp (0319-0609041)
                        </a>
                    </p>
                </div>
            </>
        );
    }



    const copyToClipboard = async (text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for non-secure contexts / older browsers
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }
            AntdMess({ type: "success", messageText: "Copied to clipboard!" });
        } catch (error) {
            console.error("Copy failed:", error);
            AntdMess({ type: "error", messageText: "Could not copy. Please copy manually." });
        }
    };

    return (
        <>
            <Seo title="Your Cart" path="/cart" robots="noindex, nofollow" />
            <Navbar />

            <div className="container my-5">
                <h1 className="h2 mb-4 text-center text-primary">Your Cart</h1>

                {/* Cart Items */}
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="card mb-3 shadow-sm border-0 p-3 cart-item"
                    >
                        <div className="row align-items-center">
                            {/* Image & Name */}
                            <div className="col-12 col-md-5 d-flex align-items-center gap-3 mb-3 mb-md-0">
                                <img
                                    src={optimizedImageUrl(item.imageUrl, 200)}
                                    alt={item.productName}
                                    className="img-fluid rounded"
                                    style={{ maxWidth: "100px", objectFit: "cover" }}
                                    loading="lazy"
                                />
                                <div>
                                    <h5 className="mb-1">{item.productName}</h5>
                                    <p className="text-muted mb-0">Price: {formatPrice(item.sellPrice)}</p>
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
                                {formatPrice(item.sellPrice * item.quantity)}
                            </div>

                            <div className="col-2 col-md-1 mb-3 mb-md-0 text-end">
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeFromCart(item.id)}
                                    title="Remove item"
                                    aria-label={`Remove ${item.productName} from cart`}
                                >
                                    <i className="fa-solid fa-trash-can" aria-hidden="true"></i>
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
                            onClick={() => {
                                if (window.confirm("Remove all items from your cart?")) clearCart();
                            }}
                        >
                            <i className="fa-solid fa-trash-can me-1" aria-hidden="true"></i>
                            Clear Cart
                        </button>
                    </div>
                    <div className="col-12 col-md-6 text-md-end">
                        {onlineDiscountValue > 0 && !isOnlinePayment && (
                            <p className="text-success fw-bold mb-1">
                                <span role="img" aria-label="gift">🎁</span> Pay online now to get {formatPrice(onlineDiscountValue)} discount!
                            </p>
                        )}
                        <p className="mb-1">Subtotal: {formatPrice(cartTotal)}</p>
                        <div className="mb-1">
                            <p>
                                Delivery Charge:{" "}
                                {fetchingDeliveryCharge ? "Calculating…" : formatPrice(safeDeliveryCharge)}
                            </p>
                        </div>
                        {discountAmount > 0 && isOnlinePayment && (
                            <p className="mb-1 text-success fw-bold">
                                Discount: - {formatPrice(discountAmount)}
                            </p>
                        )}
                        <h4 className="fw-bold">
                            Grand Total:{" "}
                            {fetchingDeliveryCharge ? "Calculating…" : formatPrice(finalGrandTotal)}
                        </h4>
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
                                        <i className="fa-solid fa-location-dot"></i>
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
                                        type="tel"
                                        className="form-control"
                                        placeholder="Enter your phone number"
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
                                        {discountAmount > 0 && (
                                            <p className="mb-2 text-primary fw-bold">
                                                <span role="img" aria-label="discount">🎉</span> You get {formatPrice(discountAmount)} discount for paying online!
                                            </p>
                                        )}
                                        <p className="mb-1">Please transfer <strong>{formatPrice(finalGrandTotal)}</strong> to the following account:</p>
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
                                        <p className="mb-1">Please transfer <strong>{formatPrice(finalGrandTotal)}</strong> to the following account:</p>
                                        {discountAmount > 0 && (
                                            <p className="mb-2 text-primary fw-bold">
                                                <span role="img" aria-label="discount">🎉</span> You get {formatPrice(discountAmount)} discount for paying online!
                                            </p>
                                        )}
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
                    <div className="mt-5">
                        <div className="position-sticky sticky-bottom w-100 bg-light border-top pt-3">
                            <p className="mb-0 text-center px-2">
                                For product details, delivery, order cancellation, or return policy, contact us on{" "}
                                <a
                                    href="https://wa.me/923190609041?text=Hi%20I%20need%20help%20with%20my%20order"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="fw-bold text-success text-decoration-none text-nowrap"
                                >
                                    <i className="fa-brands fa-whatsapp me-1"></i>
                                    WhatsApp (0319-0609041)
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Cart;

import React, { useState } from "react";
import { useCart } from "../../../Context/CartContext";
import Header from "../../../Components/Header";

const Cart = () => {
    const {
        cartItems,
        increment,
        decrement,
        removeFromCart,
        clearCart,
        cartTotal,
        deliveryCharge,
        grandTotal,
    } = useCart();

    const { fetchingdeliveryCharge, setDeliveryCharge } = useState(false)

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
                                        onClick={() => increment(item.id)}
                                        disabled={item.quantity >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="col-4 col-md-2 text-center fw-bold mb-3 mb-md-0">
                                Rs {item.sellPrice * item.quantity}
                            </div>

                            {/* Remove Button */}
                            <div className="col-2 col-md-1 mb-3 mb-md-0 text-end">
                                <button
                                    className="btn btn-danger btn-sm rounded-circle p-2"
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
                        <p className="mb-1">Delivery Charge: Rs {fetchingdeliveryCharge ? deliveryCharge : "wait..."}</p>
                        <h4 className="fw-bold">Grand Total: Rs {grandTotal}</h4>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow-sm p-4">
                            <h4 className="mb-4 text-center text-primary">Checkout</h4>
                            <form>
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
                                    <select className="form-control" id="paymentMethod">
                                        <option>Cash on Delivery</option>
                                        <option>EasyPaisa</option>
                                        <option>JazzCash</option>
                                        <option>Bank Transfer</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary w-100 mt-3">
                                    Place Order
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

import React from "react";
import { useCart } from "../../../Context/CartContext";
import Header from "../../../Components/Header";
const Cart = () => {
    const { cartItems, increment, decrement, removeFromCart, cartTotal } = useCart();

    const handleIncrement = (item) => {
        if (item.quantity < item.stock) {
            item.quantity += 1;
        }
    }

    if (cartItems.length === 0) {
        return (<>
            <Header />
            <h3 className="text-center mt-5">Your cart is empty</h3>
        </>
        );
    }

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2 className="mb-4">Your Cart</h2>

                {cartItems.map(item => (
                    <div key={item.id} className="card mb-3 p-3">
                        <div className="row align-items-center">
                            <div className="col-md-2">
                                <img
                                    src={item.imageUrl}
                                    className="img-fluid"
                                    alt={item.productName}
                                />
                            </div>

                            <div className="col-md-4">
                                <h5>{item.productName}</h5>
                                <p>Price: Rs {item.sellPrice}</p>
                            </div>

                            <div className="col-md-3">
                                <button className="btn" onClick={() => increment(item.id)}>+</button>
                                <span className="mx-2">{item.quantity}</span>
                                <button className="btn" onClick={() => decrement(item.id)}>-</button>


                            </div>
                            <div>
                                <button className="btn text-danger" onClick={() => removeFromCart(item.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>

                            <div className="col-md-3 fw-bold">
                                Total: Rs {item.sellPrice * item.quantity}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="row">
                    <h4 className="col text-end py-4">Total: Rs {cartTotal}</h4>
                </div>

            </div>
            <div className="container py-5">
                <form action="">

                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Enter your name" name="name" />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Enter your address" name="address" />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Enter your phone number" name="phone" />
                    </div>

                    <div className="d-flex">
                        <label htmlFor="paymentMethod">Select Payment Method:</label>
                        <select className="form-control">
                            <option>Cash on Delivery</option>
                            <option>EasyPaisa</option>
                            <option>JazzCash</option>
                            <option>Bank Transfer</option>
                        </select>
                    </div>
                    <div>
                        <button className="btn btn-primary mt-3 w-100">Place Order</button>
                    </div>
                </form>
            </div>

        </>
    );
};

export default Cart;

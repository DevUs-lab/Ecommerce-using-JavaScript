import React from 'react';
import { useCart } from '../Context/CartContext';
import { Link } from 'react-router-dom';

const CartModal = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <div className="modal fade" id="cartModal" tabIndex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="cartModalLabel">Your Cart</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div id="cart-items-container" className="d-flex flex-column gap-3">
                            {cart.length === 0 ? (
                                <p className="text-center text-muted">Your cart is empty.</p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="d-flex align-items-center justify-content-between border-bottom pb-2">
                                        <div className="d-flex align-items-center">
                                            <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                                            <div>
                                                <h6 className="mb-0">{item.title}</h6>
                                                <small className="text-muted">Rs {item.price}</small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >-</button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="btn btn-sm btn-outline-secondary ms-2 me-3"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >+</button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="modal-footer justify-content-between">
                        <div>
                            <strong>Total: Rs <span>{cartTotal}</span></strong>
                        </div>
                        <div>
                            <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">Close</button>
                            <button className="btn btn-primary" disabled={cart.length === 0}>Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartModal;

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';

const Navbar = () => {
    const { cartCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-2">
                <div className="container d-flex justify-content-between">
                    <p className="mb-0 header-p text-light p-2">
                        Free shipping, 30-day return or refund guarantee.
                    </p>
                    <ul className="navbar-nav d-flex flex-row ms-auto">
                        <li className="nav-item me-2">
                            <NavLink className="nav-link px-2 px-md-3" to="/login">Login</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link px-2 px-md-3" to="/register">Register</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>

            <nav className="navbar navbar-expand-lg bg-light navbar-light py-3">
                <div className="container">
                    <Link className="navbar-brand p-2 px-3" to="/">Umair Store</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="mainNav">
                            <li className="nav-item">
                                <NavLink className="nav-link px-3" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link px-3" to="/about">About</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link px-3" to="/products">Products</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link px-3" to="/contact">Contact</NavLink>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="nav-link btn cartBtn rounded-0 px-3 text-start text-lg-center border-0 bg-transparent"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cartModal"
                                >
                                    <i className="fa-solid fa-cart-flatbed "></i>
                                    <span id="count" className="ms-1">{cartCount}</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

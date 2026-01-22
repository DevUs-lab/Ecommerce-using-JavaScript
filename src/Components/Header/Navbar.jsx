import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import './Header.css';
const Navbar = () => {
    const { cartCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header>
            {/* <div className="top-bar d-none d-lg-block bg-dark">
                <div className="container py-3">
                    <div className="d-flex justify-content-end align-items-center gap-3 text-decoration-none">
                        <a href="/product-category/wall-decor" className="top-link text-decoration-none text-white">
                            Wall Decor Furniture
                        </a>
                        <a href="/product-category/tv-unit" className="top-link text-decoration-none text-white">
                            TV Entertainment Unit
                        </a>
                        <a href="/product-category/key-rack" className="top-link text-decoration-none text-white">
                            Key Chain Racks
                        </a>
                        <a href="/my-account" className="top-link text-decoration-none text-white">
                            My Account
                        </a>
                        <a href="/blog" className="top-link text-decoration-none text-white">
                            Blog
                        </a>
                        <a href="tel:+923451222223" className="top-link fw-bold text-decoration-none text-white">
                            Call Us
                        </a>
                    </div>
                </div>
            </div> */}

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
                                <NavLink className="nav-link px-3" to="/products">Products</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link px-3" to="/contact">Contact</NavLink>
                            </li>
                            <li className="nav-item">
                                {/* <button
                                    className="nav-link btn btn-danger cartBtn rounded-0 px-3 text-start text-lg-center border-0"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cartModal"
                                > */}
                                <NavLink to="/cart" className="nav-link px-3 ">
                                    {/* <i className="fa-solid fa-cart-shopping"></i> */}
                                    🛒
                                    <sup className=" mb-4"> {cartCount}</sup>
                                </NavLink>
                                {/* </button> */}
                                {/* <i className="fa-solid fa-cart-arrow-down text-dark"></i> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import './Header.css';
const Navbar = () => {
    const { cartCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-light navbar-light py-3">
                <div className="container">
                    <Link className="navbar-brand p-2 px-3" to="/">Need Buy</Link>
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
                                <NavLink to="/cart" className="nav-link px-3 ">
                                    🛒
                                    <sup className=" mb-4"> {cartCount}</sup>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

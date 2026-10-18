import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import './Header.css';

const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

const Navbar = () => {
    const { cartCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const closeMenu = () => setIsOpen(false);

    return (
        <header className="site-header sticky-top">
            {/* Delivery / contact strip */}
            <div className="top-strip bg-dark text-white text-center py-1 px-2 small">
                <i className="fa-solid fa-truck-fast me-1" aria-hidden="true"></i>
                <span>Cash on Delivery all over Pakistan</span>
                <span className="mx-2 d-none d-sm-inline">•</span>
                <a
                    className="text-white text-decoration-none d-none d-sm-inline-block"
                    href="https://wa.me/923190609041"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fa-brands fa-whatsapp me-1" aria-hidden="true"></i>
                    0319-0609041
                </a>
            </div>

            <nav className="navbar navbar-expand-lg bg-white shadow-sm py-2">
                <div className="container">
                    <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" onClick={closeMenu}>
                        <i className="fa-solid fa-bag-shopping me-2" style={{ color: "var(--nb-accent)" }} aria-hidden="true"></i>
                        Need<span className="text-primary">Buy</span>
                    </Link>

                    <div className="d-flex align-items-center gap-2 order-lg-2">
                        <NavLink
                            to="/cart"
                            className="btn btn-dark d-inline-flex align-items-center gap-2 position-relative"
                            onClick={closeMenu}
                            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
                        >
                            <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                            <span className="d-none d-sm-inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>

                        <button
                            className="navbar-toggler"
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-expanded={isOpen}
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div className={`collapse navbar-collapse order-lg-1 ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="mainNav">
                            {NAV_LINKS.map((link) => (
                                <li className="nav-item" key={link.to}>
                                    <NavLink className="nav-link px-3" to={link.to} end={link.to === "/"} onClick={closeMenu}>
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
import './footer.css'

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer bg-dark text-light">
            <div className="container py-5">
                <div className="row g-4 text-center text-md-start">

                    {/* Brand */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5 className="mb-3">
                            <Link to="/" className="text-decoration-none text-light">
                                Need Buy Store
                            </Link>
                        </h5>
                        <p className="text-white-50 small mb-0">
                            Your one-stop shop for quality products at the best
                            prices, delivered anywhere in Pakistan.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="mb-3">Shop</h6>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div className="col-6 col-md-3 col-lg-3">
                        <h6 className="mb-3">Help</h6>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-12 col-md-12 col-lg-3">
                        <h6 className="mb-3">Get in Touch</h6>
                        <ul className="list-unstyled footer-links">
                            <li className="mb-2">
                                <a
                                    href="https://wa.me/923190609041"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-whatsapp me-2"></i>
                                    0319-0609041
                                </a>
                            </li>
                            <li>
                                <a href="mailto:umairdevus@gmail.com">
                                    <i className="fa-solid fa-envelope me-2"></i>
                                    umairdevus@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom text-center py-3">
                <p className="text-white-50 small mb-0">
                    Developed by Umair Saeed (DevusPk). Contact: <a href="mailto:umairdevus@gmail.com"
                        className="text-decoration-none"> umairdevus@gmail.com</a>.<br />  © {year} All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

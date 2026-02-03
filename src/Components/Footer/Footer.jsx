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
                        <p className="text-white-50 small">
                            Your one-stop shop for quality products at the best prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="mb-3">Quick Links</h6>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/categories">Categories</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    {/* <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="mb-3">Support</h6>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                        </ul>
                    </div> */}

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom text-center py-3">
                <p className="text-white-50 small">
                    Developed by Umair Saeed (DevusPk). Contact: <a href="mailto:umairdevus@gmail.com"
                        className="text-decoration-none"> umairdevus@gmail.com</a>.<br />  © {year} All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

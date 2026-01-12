import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-dark">
            <div className="container py-5 ">
                <div className="row g-4 mt-0">
                    <div className="col-12 col-md-6 col-lg-3">
                        <nav className="text-white">
                            <Link to="/" className="text-decoration-none">Umair Store</Link>
                            <p>wellcome to Umair Store</p>
                        </nav>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3">
                        <nav className="text-white">
                            <h6 className="text-decoration-none">Shopping</h6>
                            <ul>
                                <li><Link to="/products">phones</Link></li>
                                <li><Link to="/products">loptop</Link></li>
                                <li><Link to="/products">computers</Link></li>
                                <li><Link to="/products">components</Link></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3">
                        <nav className="text-white">
                            <h6 className="text-decoration-none">Experience</h6>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/products">Deleviry</Link></li>
                                <li><Link to="/products">Retrun and Exchange</Link></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <nav className="text-white">
                            <h6 className="text-decoration-none">News Letter</h6>
                            <form action="" className="input-group rounded-0">
                                <input type="email" className="form-control rounded-0" placeholder="Enter your email" />
                                <button type="submit" className="btn btn-primary rounded-0">Send</button>
                            </form>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="bg-dark text-light text-center container-fluid opacity-25">
                <p className="mb-0 py-2">All Rights Reserved. <span>{year}</span></p>
            </div>
        </footer>
    );
};

export default Footer;

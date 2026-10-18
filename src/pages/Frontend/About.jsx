import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
import Seo from '../../Components/Seo';

const VALUES = [
    {
        icon: "fa-solid fa-shield-halved",
        title: "Quality First",
        text: "Every product is checked before it ships — no compromises.",
    },
    {
        icon: "fa-solid fa-tags",
        title: "Fair Prices",
        text: "Honest pricing with regular deals and online-payment discounts.",
    },
    {
        icon: "fa-solid fa-truck-fast",
        title: "Fast Delivery",
        text: "Orders delivered across Pakistan in 2–5 working days.",
    },
];

const About = () => {
    return (
        <>
            <Seo
                title="About Us"
                description="Learn about Need Buy Store — Pakistan's trusted online shop for quality tech gadgets, genuine products, fair prices and fast nationwide delivery."
                path="/about"
            />
            <Navbar />
            <main className="py-5">
                <div className="container">
                    <h1 className="text-center mb-5">About Us</h1>
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                                className="img-fluid rounded shadow" alt="About Us" />
                        </div>
                        <div className="col-md-6 mt-4 mt-md-0">
                            <h3>Who We Are</h3>
                            <p className="text-muted">
                                Welcome to Need Buy Store, your number one source for all things tech. We're dedicated to providing
                                you the best of products, with a focus on dependability, customer service, and uniqueness.
                            </p>
                            <p className="text-muted">
                                Founded in 2024, Need Buy Store has come a long way from its beginnings. When we first started out,
                                our passion for eco-friendly tech drove us to start our own business.
                            </p>
                            <Link to="/products" className="btn btn-primary px-4">
                                <i className="fa-solid fa-bag-shopping me-2" aria-hidden="true"></i>
                                Shop Our Products
                            </Link>
                        </div>
                    </div>

                    <div className="row g-4 mt-4">
                        {VALUES.map((value) => (
                            <div className="col-md-4" key={value.title}>
                                <div className="card h-100 border-0 shadow-sm text-center p-4">
                                    <div className="feature-icon mb-3">
                                        <i className={value.icon} aria-hidden="true"></i>
                                    </div>
                                    <h3 className="h5 mb-2">{value.title}</h3>
                                    <p className="text-muted small mb-0">{value.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default About;

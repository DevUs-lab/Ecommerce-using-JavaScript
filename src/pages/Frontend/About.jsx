import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
// import CartModal from '../../Components/CartModal';

const About = () => {
    return (
        <>
            <Navbar />
            {/* <CartModal /> */}
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
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default About;

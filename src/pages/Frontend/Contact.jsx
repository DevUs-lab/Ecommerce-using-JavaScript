import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
// import CartModal from '../../Components/CartModal';

const Contact = () => {
    return (
        <>
            <Navbar />
            {/* <CartModal /> */}
            <main className="py-5">
                <div className="container">
                    <h1 className="text-center mb-5">Contact Us</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form className="shadow p-4 rounded bg-white">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Your Name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" placeholder="Your Email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea className="form-control" id="message" rows="5" placeholder="Your Message"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Contact;

import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
// import CartModal from '../../Components/CartModal';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <>
            <Navbar />
            {/* <CartModal /> */}
            <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                    <h2 className="text-center mb-4">Register</h2>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" placeholder="Enter your name" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-dark w-100">Register</button>
                    </form>
                    <p className="mt-3 text-center">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Register;

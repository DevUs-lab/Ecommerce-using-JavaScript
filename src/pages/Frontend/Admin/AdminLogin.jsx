import React, { useState } from 'react';
import Navbar from '../../../Components/Header/Navbar';
import Footer from '../../../Components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/config';

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin"); // redirect to admin panel
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <main className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
                <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                    <h2 className="text-center mb-4">Admin Login</h2>

                    {error && <p className="text-danger text-center">{error}</p>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>

                    <p className="mt-3 text-center">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default AdminLogin;

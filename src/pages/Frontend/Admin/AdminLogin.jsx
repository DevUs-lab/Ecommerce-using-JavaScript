import React, { useState } from 'react';
import Navbar from '../../../Components/Header/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Seo from '../../../Components/Seo';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/config';

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin"); // redirect to admin panel
        } catch (err) {
            console.error("Login failed:", err);
            const friendlyMessages = {
                "auth/invalid-credential": "Invalid email or password.",
                "auth/wrong-password": "Invalid email or password.",
                "auth/user-not-found": "Invalid email or password.",
                "auth/invalid-email": "Please enter a valid email address.",
                "auth/too-many-requests": "Too many attempts. Please try again later.",
            };
            setError(friendlyMessages[err?.code] || "Login failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <>
            <Seo title="Admin Login" path="/adminlogin" robots="noindex, nofollow" />
            <Navbar />
            <main className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
                <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                    <h1 className="h3 text-center mb-4">Admin Login</h1>

                    {error && <p className="text-danger text-center">{error}</p>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="adminEmail" className="form-label">Email address</label>
                            <input
                                id="adminEmail"
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="adminPassword" className="form-label">Password</label>
                            <input
                                id="adminPassword"
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default AdminLogin;

import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { Spin } from "antd";

export default function AppRouter() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
                navigate("/adminlogin");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/adminlogin");
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spin size="large" /></div>;

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">

                <div
                    className={`bg-dark text-white p-4 position-fixed top-0 start-0 vh-100 overflow-auto ${sidebarOpen ? "d-block" : "d-none d-md-block"
                        }`}
                    style={{ width: "250px", zIndex: 9999 }}
                >
                    <h3 className="text-center mb-4">Admin Panel</h3>

                    <Link
                        to="/admin"
                        className="d-block py-2 text-white text-decoration-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link to="/admin/orders" className="d-block py-2 text-decoration-none text-white">
                        Orders
                    </Link>

                    <Link
                        to="/admin/users"
                        className="d-block py-2 text-white text-decoration-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Users
                    </Link>
                    <Link
                        to="/admin/add-products"
                        className="d-block py-2 text-white text-decoration-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Add-Products
                    </Link>
                    <Link
                        to="/admin/settings"
                        className="d-block py-2 text-white text-decoration-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Settings
                    </Link>

                    <button className="btn btn-danger mt-4 w-100" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Mobile toggle button */}
                <button
                    className="btn btn-dark d-md-none position-fixed top-0 start-0 m-2"
                    style={{ zIndex: 10000 }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰
                </button>

                {/* Content */}
                <div
                    className="col-12 col-md-9 offset-md-3 p-4 bg-light min-vh-100"
                    style={{ minHeight: "100vh" }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

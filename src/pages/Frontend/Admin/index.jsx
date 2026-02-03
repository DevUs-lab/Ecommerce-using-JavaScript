import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import AntdSpin from "../../../Components/Antd";
import "./index.css"

export default function AppRouter() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

    if (loading) {
        return (
            <AntdSpin fullscreen size="large"/>
        );
    }

    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar */}
            <aside
                className={`bg-dark text-white p-4 sidebar ${sidebarOpen ? "open" : ""
                    }`}
            >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Admin Panel</h4>
                    <button
                        className="btn btn-sm btn-light d-md-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <nav className="d-flex flex-column gap-2">
                    <Link to="/admin" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Dashboard</Link>
                    <Link to="/admin/orders-pending" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Orders Pending</Link>
                    <Link to="/admin/order-delivered" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Orders Delivered</Link>
                    <Link to="/admin/users" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Users</Link>
                    <Link to="/admin/add-products" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Add Products</Link>
                    <Link to="/admin/settings" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Settings</Link>
                </nav>

                <button className="btn btn-danger mt-4 w-100" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            {/* Overlay (mobile only) */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay d-md-none"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-grow-1 bg-light">
                {/* Mobile top bar */}
                <div className="d-md-none p-3 bg-dark text-white">
                    <button
                        className="btn btn-light"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>
                </div>

                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

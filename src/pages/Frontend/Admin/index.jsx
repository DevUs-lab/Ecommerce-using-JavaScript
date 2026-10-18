import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import AntdSpin, { AntdMess } from "../../../Components/Antd";
import Seo from "../../../Components/Seo";
import "./index.css"

export default function AppRouter() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!active) return;

            if (!currentUser) {
                setLoading(false);
                navigate("/admin-login", { replace: true });
                return;
            }

            try {
                // Only accounts listed in the `admins` collection may use the panel.
                const adminSnap = await getDoc(doc(db, "admins", currentUser.uid));
                if (!active) return;

                if (adminSnap.exists()) {
                    setIsAdmin(true);
                } else {
                    AntdMess({
                        type: "error",
                        messageText: "This account does not have admin access.",
                    });
                    await signOut(auth);
                    navigate("/admin-login", { replace: true });
                }
            } catch (error) {
                console.error("Admin check failed:", error);
                if (active) navigate("/admin-login", { replace: true });
            } finally {
                if (active) setLoading(false);
            }
        });

        return () => {
            active = false;
            unsubscribe();
        };
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/admin-login");
    };

    if (loading) {
        return (
            <AntdSpin fullscreen size="large" />
        );
    }

    if (!isAdmin) {
        // Redirecting to the login page.
        return null;
    }

    return (
        <div className="d-flex min-vh-100">
            <Seo title="Admin Panel" path="/admin/" robots="noindex, nofollow" />

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
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <nav className="d-flex flex-column gap-2">
                    <Link to="/admin" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Dashboard</Link>
                    <Link to="/admin/orders-pending" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Orders Pending</Link>
                    <Link to="/admin/order-delivered" onClick={() => setSidebarOpen(false)} className="text-white text-decoration-none">Orders Delivered</Link>
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
                        aria-label="Open menu"
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

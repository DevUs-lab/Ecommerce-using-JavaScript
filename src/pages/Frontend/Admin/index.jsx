import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import AntdSpin, { AntdMess } from "../../../Components/Antd";
import Seo from "../../../Components/Seo";
import "./index.css"

const NAV_ITEMS = [
    { to: "/admin", label: "Dashboard", icon: "fa-gauge-high", end: true },
    { to: "/admin/orders-pending", label: "Orders Pending", icon: "fa-clock" },
    { to: "/admin/order-delivered", label: "Orders Delivered", icon: "fa-circle-check" },
    { to: "/admin/add-products", label: "Products", icon: "fa-box" },
    { to: "/admin/settings", label: "Settings", icon: "fa-gear" },
];

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
                className={`bg-dark text-white p-3 sidebar ${sidebarOpen ? "open" : ""
                    }`}
            >
                <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                    <h4 className="mb-0">Admin Panel</h4>
                    <button
                        className="btn btn-sm btn-light d-md-none"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <p
                    className="small text-secondary text-truncate px-2 mb-3"
                    title={auth?.currentUser?.email || ""}
                >
                    <i className="fa-solid fa-user-shield me-2" aria-hidden="true"></i>
                    {auth?.currentUser?.email || "Admin"}
                </p>

                <nav className="d-flex flex-column gap-1 mb-3">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `admin-nav-link text-decoration-none d-flex align-items-center gap-2 px-2 py-2 rounded ${isActive ? "bg-primary text-white" : "text-white-50"
                                }`
                            }
                        >
                            <i className={`fa-solid ${item.icon} fa-fw`} aria-hidden="true"></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto d-flex flex-column gap-2 px-1">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-nav-link text-decoration-none d-flex align-items-center gap-2 px-2 py-2 rounded text-white-50"
                    >
                        <i className="fa-solid fa-arrow-up-right-from-square fa-fw" aria-hidden="true"></i>
                        <span>View Store</span>
                    </a>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket me-2" aria-hidden="true"></i>
                        Logout
                    </button>
                </div>
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
                <div className="d-md-none p-3 bg-dark text-white d-flex align-items-center justify-content-between">
                    <button
                        className="btn btn-light"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        ☰
                    </button>
                    <span className="fw-semibold">Admin Panel</span>
                </div>

                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

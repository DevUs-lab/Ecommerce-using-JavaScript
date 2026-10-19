import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { getProducts } from "../../../Context/getProducts";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { formatPrice, formatCategory, formatDateTime, shortId, toDate } from "../../../utils/format";
import { StatusBadge } from "./OrderBadges";

const LOW_STOCK_THRESHOLD = 5;

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products and orders in parallel — they are independent.
                const [productsData, ordersSnapshot] = await Promise.all([
                    getProducts(),
                    getDocs(collection(db, "orders")),
                ]);

                setProducts(productsData);
                setOrders(ordersSnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = useMemo(() => {
        const delivered = orders.filter((order) => order.status === "delivered");
        const pending = orders.filter((order) => order.status === "pending");
        const sum = (list) => list.reduce((acc, order) => acc + (Number(order.grandTotal) || 0), 0);

        const outOfStock = products.filter((product) => Number(product.stock) <= 0);
        const lowStock = products.filter(
            (product) => Number(product.stock) > 0 && Number(product.stock) <= LOW_STOCK_THRESHOLD
        );

        return {
            totalOrders: orders.length,
            pendingCount: pending.length,
            deliveredCount: delivered.length,
            deliveredRevenue: sum(delivered),
            pendingValue: sum(pending),
            totalProducts: products.length,
            outOfStock,
            lowStock,
        };
    }, [orders, products]);

    const recentOrders = useMemo(
        () =>
            [...orders]
                .sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0))
                .slice(0, 6),
        [orders]
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spin />
            </div>
        );
    }

    const stockAlerts = [...stats.outOfStock, ...stats.lowStock];

    return (
        <>
            <h1 className="h2 mb-4">Dashboard Overview</h1>

            <div className="row g-3">
                {/* Orders */}
                <div className="col-sm-6 col-xl-3">
                    <div
                        className="card border-0 shadow-sm h-100 stat-card"
                        onClick={() => navigate("/admin/orders-pending")}
                    >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small text-uppercase mb-1">Total Orders</p>
                                    <h2 className="mb-0">{stats.totalOrders}</h2>
                                </div>
                                <i className="fa-solid fa-cart-shopping fa-2x text-primary opacity-50" aria-hidden="true"></i>
                            </div>
                            <p className="mb-0 mt-3 small text-muted">
                                <span className="text-warning fw-semibold">{stats.pendingCount} pending</span>
                                {" • "}
                                <span className="text-success fw-semibold">{stats.deliveredCount} delivered</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Revenue */}
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small text-uppercase mb-1">Delivered Revenue</p>
                                    <h2 className="mb-0">{formatPrice(stats.deliveredRevenue)}</h2>
                                </div>
                                <i className="fa-solid fa-sack-dollar fa-2x text-success opacity-50" aria-hidden="true"></i>
                            </div>
                            <p className="mb-0 mt-3 small text-muted">
                                Pending value: <span className="fw-semibold">{formatPrice(stats.pendingValue)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="col-sm-6 col-xl-3">
                    <div
                        className="card border-0 shadow-sm h-100 stat-card"
                        onClick={() => navigate("/admin/add-products")}
                    >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small text-uppercase mb-1">Products</p>
                                    <h2 className="mb-0">{stats.totalProducts}</h2>
                                </div>
                                <i className="fa-solid fa-box fa-2x text-primary opacity-50" aria-hidden="true"></i>
                            </div>
                            <p className="mb-0 mt-3 small text-muted">
                                <span className="text-warning fw-semibold">{stats.lowStock.length} low stock</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Out of stock */}
                <div className="col-sm-6 col-xl-3">
                    <div
                        className="card border-0 shadow-sm h-100 stat-card"
                        onClick={() => navigate("/admin/add-products")}
                    >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small text-uppercase mb-1">Out of Stock</p>
                                    <h2 className={`mb-0 ${stats.outOfStock.length > 0 ? "text-danger" : ""}`}>
                                        {stats.outOfStock.length}
                                    </h2>
                                </div>
                                <i className="fa-solid fa-triangle-exclamation fa-2x text-danger opacity-50" aria-hidden="true"></i>
                            </div>
                            <p className="mb-0 mt-3 small text-muted">
                                {stats.outOfStock.length > 0 ? "Needs restocking" : "Everything is stocked"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mt-1">
                {/* Recent orders */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Recent Orders</h5>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => navigate("/admin/orders-pending")}
                            >
                                View all
                            </button>
                        </div>
                        <div className="card-body p-0">
                            {recentOrders.length === 0 ? (
                                <p className="text-muted p-3 mb-0">No orders yet.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Order</th>
                                                <th>Customer</th>
                                                <th className="text-end">Total</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    role="button"
                                                    onClick={() =>
                                                        navigate(
                                                            order.status === "delivered"
                                                                ? "/admin/order-delivered"
                                                                : "/admin/orders-pending"
                                                        )
                                                    }
                                                >
                                                    <td className="text-muted small">{formatDateTime(order.createdAt, "N/A")}</td>
                                                    <td className="font-monospace small" title={order.id}>
                                                        {shortId(order.id)}
                                                    </td>
                                                    <td>{order.customerName || "—"}</td>
                                                    <td className="text-end fw-semibold">{formatPrice(order.grandTotal)}</td>
                                                    <td>
                                                        <StatusBadge status={order.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stock alerts */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Stock Alerts</h5>
                            <span className="badge bg-danger">{stats.outOfStock.length} out</span>
                        </div>
                        <div className="card-body p-0">
                            {stockAlerts.length === 0 ? (
                                <p className="text-muted p-3 mb-0">All products are well stocked.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th className="text-end">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockAlerts.map((product) => (
                                                <tr key={product.id}>
                                                    <td
                                                        className="text-truncate"
                                                        style={{ maxWidth: "180px" }}
                                                        title={product.productName}
                                                    >
                                                        {product.productName || "—"}
                                                    </td>
                                                    <td className="text-muted small">{formatCategory(product.category)}</td>
                                                    <td className="text-end">
                                                        {Number(product.stock) <= 0 ? (
                                                            <span className="badge bg-danger">Out</span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark">
                                                                {Number(product.stock)} left
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

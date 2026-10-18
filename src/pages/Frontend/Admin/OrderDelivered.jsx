import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Spin } from "antd";
import { AntdMess } from "../../../Components/Antd";
import { formatPrice, formatDateTime, shortId, toDate } from "../../../utils/format";
import { PaymentBadge } from "./OrderBadges";
import OrderDetailModal from "./OrderDetailModal";

const OrderDelivered = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const snapshot = await getDocs(collection(db, "orders"));
                const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                AntdMess({ type: "error", messageText: "Failed to fetch orders" });
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const deliveredOrders = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return orders
            .filter((order) => order.status === "delivered")
            .filter(
                (order) =>
                    !term
                    || String(order.id).toLowerCase().includes(term)
                    || String(order.customerName || "").toLowerCase().includes(term)
                    || String(order.phone || "").includes(term)
            )
            .sort(
                (a, b) =>
                    (toDate(b.deliveredAt || b.createdAt)?.getTime() || 0)
                    - (toDate(a.deliveredAt || a.createdAt)?.getTime() || 0)
            );
    }, [orders, searchTerm]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spin />
            </div>
        );
    }

    const deliveredValue = deliveredOrders.reduce((acc, order) => acc + (Number(order.grandTotal) || 0), 0);

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <div>
                    <h1 className="h2 mb-1">Delivered Orders</h1>
                    <p className="text-muted mb-0">
                        {deliveredOrders.length} order{deliveredOrders.length === 1 ? "" : "s"}
                        {deliveredOrders.length > 0 && <> • {formatPrice(deliveredValue)} earned</>}
                    </p>
                </div>
                <input
                    type="search"
                    className="form-control"
                    style={{ maxWidth: "300px" }}
                    placeholder="Search by name, phone or order ID..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Delivered</th>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Payment</th>
                                <th className="text-end">Total</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="text-muted small">
                                        {formatDateTime(order.deliveredAt || order.createdAt, "N/A")}
                                    </td>
                                    <td className="font-monospace small" title={order.id}>
                                        {shortId(order.id)}
                                    </td>
                                    <td>
                                        <div>{order.customerName || "—"}</div>
                                        {order.phone && (
                                            <a className="small text-decoration-none" href={`tel:${order.phone}`}>
                                                <i className="fa-solid fa-phone me-1" aria-hidden="true"></i>
                                                {order.phone}
                                            </a>
                                        )}
                                    </td>
                                    <td>
                                        {(order.items || []).length} item
                                        {(order.items || []).length === 1 ? "" : "s"}
                                    </td>
                                    <td>
                                        <PaymentBadge method={order.paymentMethod} />
                                    </td>
                                    <td className="text-end fw-semibold">{formatPrice(order.grandTotal)}</td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <i className="fa-solid fa-eye me-1" aria-hidden="true"></i>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {deliveredOrders.length === 0 && (
                    <p className="text-muted p-4 mb-0 text-center">
                        {orders.filter((order) => order.status === "delivered").length === 0
                            ? "No delivered orders yet."
                            : "No orders match your search."}
                    </p>
                )}
            </div>

            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </>
    );
};

export default OrderDelivered;

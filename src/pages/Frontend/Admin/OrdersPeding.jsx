import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Spin } from "antd";
import { AntdMess } from "../../../Components/Antd";
import { formatPrice, formatDateTime, shortId, toDate } from "../../../utils/format";
import { StatusBadge, PaymentBadge } from "./OrderBadges";
import OrderDetailModal from "./OrderDetailModal";

const OrdersPending = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deliveringId, setDeliveringId] = useState(null);
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

    const markAsDelivered = async (orderId) => {
        if (!window.confirm("Mark this order as delivered?")) return;

        setDeliveringId(orderId);
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: "delivered",
                deliveredAt: serverTimestamp(),
            });

            // update UI without reloading
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? { ...order, status: "delivered", deliveredAt: new Date() }
                        : order
                )
            );
            setSelectedOrder(null);
            AntdMess({ type: "success", messageText: "Order marked as delivered" });
        } catch (error) {
            console.error("Error updating status:", error);
            AntdMess({ type: "error", messageText: "Failed to update order status" });
        } finally {
            setDeliveringId(null);
        }
    };

    const pendingOrders = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return orders
            .filter((order) => order.status === "pending")
            .filter(
                (order) =>
                    !term
                    || String(order.id).toLowerCase().includes(term)
                    || String(order.customerName || "").toLowerCase().includes(term)
                    || String(order.phone || "").includes(term)
            )
            .sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0));
    }, [orders, searchTerm]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spin />
            </div>
        );
    }

    const totalPendingCount = orders.filter((order) => order.status === "pending").length;
    const pendingValue = pendingOrders.reduce((acc, order) => acc + (Number(order.grandTotal) || 0), 0);

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <div>
                    <h1 className="h2 mb-1">Pending Orders</h1>
                    <p className="text-muted mb-0">
                        {totalPendingCount} order{totalPendingCount === 1 ? "" : "s"} waiting
                        {pendingOrders.length > 0 && <> • {formatPrice(pendingValue)} to collect</>}
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
                                <th>Date</th>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Payment</th>
                                <th className="text-end">Total</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="text-muted small">{formatDateTime(order.createdAt, "N/A")}</td>
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
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <i className="fa-solid fa-eye me-1" aria-hidden="true"></i>
                                                View
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => markAsDelivered(order.id)}
                                                disabled={deliveringId === order.id}
                                            >
                                                {deliveringId === order.id ? (
                                                    "Updating..."
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-check me-1" aria-hidden="true"></i>
                                                        Delivered
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {pendingOrders.length === 0 && (
                    <p className="text-muted p-4 mb-0 text-center">
                        {totalPendingCount === 0
                            ? "No pending orders — all caught up!"
                            : "No orders match your search."}
                    </p>
                )}
            </div>

            <OrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onMarkDelivered={markAsDelivered}
            />
        </>
    );
};

export default OrdersPending;

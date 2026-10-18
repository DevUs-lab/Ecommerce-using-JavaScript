import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Spin } from "antd";
import { AntdMess } from "../../../Components/Antd";
import { formatPrice } from "../../../utils/format";

const OrdersPending = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deliveringId, setDeliveringId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const snapshot = await getDocs(collection(db, "orders"));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                status: "delivered"
            });

            // update UI without reloading
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, status: "delivered" }
                        : order
                )
            );
            AntdMess({ type: "success", messageText: "Order marked as delivered" });
        } catch (error) {
            console.error("Error updating status:", error);
            AntdMess({ type: "error", messageText: "Failed to update order status" });
        } finally {
            setDeliveringId(null);
        }
    };


    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{
            minHeight: "100vh",
        }}><Spin /></div>;
    }

    const pendingOrders = orders.filter(order => order.status === "pending");

    return (
        <div className="container ms-0 ms-md-4 ms-lg-0">
            <h2>Pending Orders</h2>
            {pendingOrders.length === 0 && (
                <p className="text-muted mt-3">No pending orders.</p>
            )}
            {pendingOrders.map(order => (
                <div key={order.id} className="card mb-2 p-3">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Name:</strong> {order.customerName || "—"}</p>
                    <p><strong>Address:</strong> {order.address || "—"}</p>
                    <p><strong>Phone:</strong> {order.phone || "—"}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod || "—"}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
                        {(order.items || []).map(item => (
                            <li key={item.id}>
                                {item.productName} x {item.quantity} = {formatPrice((Number(item.quantity) || 0) * (Number(item.sellPrice) || 0))}
                            </li>
                        ))}
                    </ul>
                    <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                    <p><strong>Delivery Charge:</strong> {formatPrice(order.deliveryCharge)}</p>
                    {Number(order.discount) > 0 && (
                        <p><strong>Discount:</strong> - {formatPrice(order.discount)}</p>
                    )}
                    <p><strong>Grand Total:</strong> {formatPrice(order.grandTotal)}</p>
                    <p>
                        <strong>Status:</strong> {order.status}

                        <button
                            className="btn btn-sm btn-primary ms-3"
                            onClick={() => markAsDelivered(order.id)}
                            disabled={deliveringId === order.id}
                        >
                            {deliveringId === order.id ? "Updating..." : "Mark as Delivered"}
                        </button>
                    </p>

                </div>
            ))}
        </div>
    );
};

export default OrdersPending;

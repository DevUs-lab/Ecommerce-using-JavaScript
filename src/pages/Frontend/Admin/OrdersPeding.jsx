import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import AntdSpin from "../../../Components/Antd";

const OrdersPending = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchOrders = async () => {
            const snapshot = await getDocs(collection(db, "orders"));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const markAsDelivered = async (orderId) => {
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
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };


    if (loading) {
        return <AntdSpin fullscreen tip="Loading orders..." />;
    }

    return (
        <div className="container ms-0 ms-md-4 ms-lg-0">
            <h2>Orders</h2>
            {orders.filter(order => order.status === "pending").map(order => (
                <div key={order.id} className="card mb-2 p-3">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Name:</strong> {order.customerName}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
                        {order.items.map(item => (
                            <li key={item.id}>{item.productName} x {item.quantity} = Rs {item.quantity * item.sellPrice}</li>
                        ))}
                    </ul>
                    <p><strong>Total:</strong> Rs {order.total}</p>
                    <p><strong>Delivery Charge:</strong> Rs {order.deliveryCharge}</p>
                    <p><strong>Grand Total:</strong> Rs {order.grandTotal}</p>
                    <p>
                        <strong>Status:</strong> {order.status}

                        {order.status !== "delivered" && (
                            <button
                                className="btn btn-sm btn-primary ms-3"
                                onClick={() => markAsDelivered(order.id)}
                            >
                                Mark as Delivered
                            </button>
                        )}
                    </p>

                </div>
            ))}
        </div>
    );
};

export default OrdersPending;

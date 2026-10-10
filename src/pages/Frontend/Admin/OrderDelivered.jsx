import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Spin } from "antd";
import { AntdMess } from "../../../Components/Antd";

const OrderDelivered = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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


    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{
            minHeight: "100vh",
        }}><Spin /></div>;
    }

    const deliveredOrders = orders.filter(order => order.status === "delivered");

    return (
        <div className="container ms-0 ms-md-4 ms-lg-0">
            <h2>Delivered Orders</h2>
            {deliveredOrders.length === 0 && (
                <p className="text-muted mt-3">No delivered orders yet.</p>
            )}
            {deliveredOrders.map(order => (
                <div key={order.id} className="card mb-2 p-3">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Name:</strong> {order.customerName}</p>
                    <p><strong>Address:</strong> {order.address}</p>
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
                    {order.discount > 0 && <p><strong>Discount:</strong> - Rs {order.discount}</p>}
                    <p><strong>Grand Total:</strong> Rs {order.grandTotal}</p>
                    <p><strong>Status:</strong> <span className="badge bg-success">Delivered</span></p>
                </div>
            ))}
        </div>
    );
};

export default OrderDelivered;

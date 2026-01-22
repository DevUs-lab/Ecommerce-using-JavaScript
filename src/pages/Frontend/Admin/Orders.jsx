import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Spin } from "antd";

const Orders = () => {
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

    if (loading) {
        return <div className="min-vh-100 d-flex align-items-center justify-content-center"><Spin /></div>;
    }

    return (
        <div className="container">
            <h2>Orders</h2>
            {orders.map(order => (
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
                    <p><strong>Status:</strong> {order.status}</p>
                </div>
            ))}
        </div>
    );
};

export default Orders;

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { getProducts } from "../../../Context/getProducts";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0, // Placeholder as we don't have user fetching logic right now or ignoring for this task
        totalProducts: 0,
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        outOfStockCount: 0
    });
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Products
                const productsData = await getProducts();
                const totalProducts = productsData.length;
                const outOfStock = productsData.filter(p => p.stock <= 0);

                // Fetch Orders
                const ordersSnapshot = await getDocs(collection(db, "orders"));
                const ordersData = ordersSnapshot.docs.map(doc => doc.data());

                const totalOrders = ordersData.length;
                const completedOrders = ordersData.filter(o => o.status === "Delivered" || o.status === "Completed").length;
                const pendingOrders = ordersData.filter(o => o.status === "Pending").length;

                setStats({
                    totalUsers: 120, // Keep hardcoded or implement user fetch if needed
                    totalProducts,
                    totalOrders,
                    completedOrders,
                    pendingOrders,
                    outOfStockCount: outOfStock.length
                });
                setOutOfStockProducts(outOfStock);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-4">Loading Dashboard...</div>;
    }

    return (
        <>
            <h2 className="mb-4">Dashboard Overview</h2>

            <div className="row g-3">
                {/* Orders Stats */}
                <div className="col-md-4" onClick={() => navigate("/admin/orders")}>
                    <div className="card p-3 shadow-sm border-0 bg-primary text-white">
                        <h5>Total Orders</h5>
                        <h2>{stats.totalOrders}</h2>
                        <small>{stats.pendingOrders} Pending | {stats.completedOrders} Completed</small>
                    </div>
                </div>

                {/* Products Stats */}
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm border-0 bg-success text-white">
                        <h5>Total Products</h5>
                        <h2>{stats.totalProducts}</h2>
                        <small>{stats.outOfStockCount} Out of Stock</small>
                    </div>
                </div>

                {/* Users Stats (Placeholder) */}
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm border-0 bg-secondary text-white">
                        <h5>Total Users</h5>
                        <h2>{stats.totalUsers}</h2>
                    </div>
                </div>
            </div>

            {/* Out of Stock Products Section */}
            {stats.outOfStockCount > 0 && (
                <div className="mt-5">
                    <h4 className="text-danger mb-3">Out of Stock Products</h4>
                    <div className="card shadow-sm">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {outOfStockProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.title || product.productName || "N/A"}</td>
                                            <td>{product.category}</td>
                                            <td>Rs {product.price}</td>
                                            <td><span className="badge bg-danger">Out of Stock</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

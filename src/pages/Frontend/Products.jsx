import React, { useEffect, useMemo, useState } from "react";
import { Spin } from "antd";
import Navbar from "../../Components/Header/Navbar";
import Footer from "../../Components/Footer/Footer";
import ProductCard from "../../Components/ProductCard";
import Seo from "../../Components/Seo";
import { getProducts } from "../../Context/getProducts";
import { AntdMess } from "../../Components/Antd";
import { formatCategory } from "../../utils/format";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                setProducts(data.filter((product) => Number(product.stock) > 0));
            } catch (error) {
                console.error(error);
                AntdMess({ type: "error", messageText: "Failed to fetch products" });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const groupedProducts = useMemo(
        () =>
            products.reduce((acc, product) => {
                const category = product.category || "other";
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
            }, {}),
        [products]
    );

    return (
        <>
            <Seo
                title="Products – Shop Tech Gadgets & Accessories Online"
                description="Browse all products at Need Buy Store: smartwatches, earbuds, headphones, mobile accessories and more at the best prices in Pakistan with fast nationwide delivery."
                path="/products"
            />
            <Navbar />
            <main className="py-5">
                <div className="container">
                    <h1 className="text-center fw-bold mb-5">Our Products</h1>

                    {loading && (
                        <div className="text-center py-5">
                            <Spin size="large" />
                            <p className="text-muted mt-3 mb-0">Loading products…</p>
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <p className="text-center text-muted mb-0">
                            No products available right now. Please check back soon.
                        </p>
                    )}

                    {!loading &&
                        Object.entries(groupedProducts).map(([category, items]) => (
                            <section key={category} className="mb-5">
                                <h2 className="h4 text-center text-capitalize mb-4">
                                    {formatCategory(category)}
                                </h2>
                                <div className="row g-3">
                                    {items.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        ))}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Products;

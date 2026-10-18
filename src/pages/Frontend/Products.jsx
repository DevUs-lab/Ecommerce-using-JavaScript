import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
    const [searchTerm, setSearchTerm] = useState("");

    // The active category lives in the URL (?category=slug) so the links on
    // the home page and back/forward navigation keep working.
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get("category") || "all";

    const setActiveCategory = (category) => {
        if (category === "all") {
            setSearchParams({});
        } else {
            setSearchParams({ category });
        }
    };

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

    const categories = useMemo(
        () =>
            products.reduce((acc, product) => {
                const category = product.category || "other";
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
            }, {}),
        [products]
    );

    const filteredByCategory = useMemo(
        () =>
            Object.entries(categories).filter(
                ([category]) => activeCategory === "all" || category === activeCategory
            ),
        [categories, activeCategory]
    );

    const matchesSearch = (product) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
            String(product.productName || "").toLowerCase().includes(term)
            || String(product.descriptions || "").toLowerCase().includes(term)
        );
    };

    const visibleProducts = useMemo(
        () =>
            filteredByCategory
                .map(([category, items]) => [category, items.filter(matchesSearch)])
                .filter(([, items]) => items.length > 0),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filteredByCategory, searchTerm]
    );

    const visibleCount = visibleProducts.reduce((acc, [, items]) => acc + items.length, 0);

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
                    <h1 className="text-center fw-bold mb-4">Our Products</h1>

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

                    {!loading && products.length > 0 && (
                        <>
                            {/* Search */}
                            <div className="row justify-content-center mb-4">
                                <div className="col-md-6">
                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-white">
                                            <i className="fa-solid fa-magnifying-glass text-muted" aria-hidden="true"></i>
                                        </span>
                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(event) => setSearchTerm(event.target.value)}
                                            aria-label="Search products"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category filter */}
                            <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                                <button
                                    type="button"
                                    className={`btn btn-sm rounded-pill px-3 ${activeCategory === "all" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setActiveCategory("all")}
                                >
                                    All ({products.length})
                                </button>
                                {Object.entries(categories).map(([category, items]) => (
                                    <button
                                        key={category}
                                        type="button"
                                        className={`btn btn-sm rounded-pill px-3 ${activeCategory === category ? "btn-primary" : "btn-outline-secondary"}`}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {formatCategory(category)} ({items.length})
                                    </button>
                                ))}
                            </div>

                            <p className="text-center text-muted small mb-5">
                                Showing {visibleCount} product{visibleCount === 1 ? "" : "s"}
                                {activeCategory !== "all" && <> in {formatCategory(activeCategory)}</>}
                            </p>
                        </>
                    )}

                    {!loading && products.length > 0 && visibleProducts.length === 0 && (
                        <p className="text-center text-muted mb-0">
                            No products match your search.
                        </p>
                    )}

                    {!loading &&
                        visibleProducts.map(([category, items]) => (
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

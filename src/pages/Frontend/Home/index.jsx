import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import Navbar from "../../../Components/Header/Navbar";
import Footer from "../../../Components/Footer/Footer";
import ProductCard from "../../../Components/ProductCard";
import Seo, { SITE_URL } from "../../../Components/Seo";
import { getProducts } from "../../../Context/getProducts";
import { AntdMess } from "../../../Components/Antd";
import { formatCategory } from "../../../utils/format";

const STORE_DESCRIPTION =
    "Need Buy is Pakistan's leading online shopping store offering quality tech gadgets, affordable prices, and fast delivery nationwide. Shop smartwatches, earbuds, headphones and accessories online.";

const FEATURES = [
    {
        icon: "fa-truck-fast",
        title: "Fast Delivery",
        text: "2–5 days anywhere in Pakistan",
    },
    {
        icon: "fa-money-bill-wave",
        title: "Cash on Delivery",
        text: "Pay when your order arrives",
    },
    {
        icon: "fa-shield-halved",
        title: "Quality Products",
        text: "Every item is checked before shipping",
    },
    {
        icon: "fa-headset",
        title: "Easy Support",
        text: "WhatsApp us at 0319-0609041",
    },
];

const Home = () => {
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

    const storeJsonLd = {
        "@context": "https://schema.org",
        "@type": "OnlineStore",
        name: "Need Buy Store",
        url: SITE_URL,
        logo: `${SITE_URL}/apple-touch-icon.webp`,
        image: `${SITE_URL}/hero.webp`,
        description: STORE_DESCRIPTION,
        email: "umairdevus@gmail.com",
        telephone: "+923190609041",
        currenciesAccepted: "PKR",
        paymentAccepted: "Cash on Delivery, EasyPaisa, JazzCash, Bank Transfer",
        priceRange: "Rs",
        address: { "@type": "PostalAddress", addressCountry: "PK" },
    };

    return (
        <>
            <Seo
                title="Need Buy – Online Shopping Store in Pakistan"
                description={STORE_DESCRIPTION}
                path="/"
                jsonLd={storeJsonLd}
            />
            <Navbar />
            <main>
                <section className="hero pb-2 pb-md-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8 text-white">
                                <h1 className="display-4 fw-bold">
                                    Welcome to Need Buy Store
                                </h1>
                                <p className="lead">
                                    Your one-stop shop for the best tech gadgets at
                                    the best prices, delivered anywhere in Pakistan.
                                </p>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    <Link
                                        to="/products"
                                        className="btn btn-light btn-lg rounded-0 text-dark fw-bold px-4"
                                    >
                                        <i className="fa-solid fa-bag-shopping me-2" aria-hidden="true"></i>
                                        Shop Now
                                    </Link>
                                    <a
                                        href="https://wa.me/923190609041?text=Hi%2C%20I%20want%20to%20order%20from%20Need%20Buy%20Store"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success btn-lg rounded-0 fw-bold px-4"
                                    >
                                        <i className="fa-brands fa-whatsapp me-2" aria-hidden="true"></i>
                                        Order on WhatsApp
                                    </a>
                                </div>
                                <div className="d-flex flex-wrap gap-3 mt-4 text-white-50 small">
                                    <span><i className="fa-solid fa-money-bill-wave me-1" aria-hidden="true"></i>Cash on Delivery</span>
                                    <span><i className="fa-solid fa-truck-fast me-1" aria-hidden="true"></i>Fast Nationwide Delivery</span>
                                    <span><i className="fa-solid fa-tags me-1" aria-hidden="true"></i>Best Prices</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="custom-shape-divider-bottom-1768204145">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                        </svg>
                    </div>
                </section>

                {/* Why shop with us */}
                <section className="py-5 bg-white border-bottom">
                    <div className="container">
                        <div className="row g-4 text-center">
                            {FEATURES.map((feature) => (
                                <div className="col-6 col-lg-3" key={feature.title}>
                                    <div className="feature-icon mb-3">
                                        <i className={`fa-solid ${feature.icon}`} aria-hidden="true"></i>
                                    </div>
                                    <h2 className="h6 fw-bold mb-1">{feature.title}</h2>
                                    <p className="text-muted small mb-0">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="products" className="py-5">
                    <div className="container">
                        <h2 className="text-center fw-bold mb-4">Featured Products</h2>

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
                            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                                {Object.entries(groupedProducts).map(([category, items]) => (
                                    <Link
                                        key={category}
                                        to={`/products?category=${encodeURIComponent(category)}`}
                                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                    >
                                        {formatCategory(category)}{" "}
                                        <span className="text-muted">({items.length})</span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!loading &&
                            Object.entries(groupedProducts).map(([category, items]) => (
                                <section key={category} className="mb-5">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h3 className="h4 mb-0 text-capitalize">
                                            {formatCategory(category)}
                                        </h3>
                                        <Link
                                            to={`/products?category=${encodeURIComponent(category)}`}
                                            className="small text-decoration-none text-nowrap"
                                        >
                                            View all <i className="fa-solid fa-arrow-right ms-1" aria-hidden="true"></i>
                                        </Link>
                                    </div>
                                    <div className="row g-3">
                                        {items.slice(0, 4).map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </section>
                            ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Home;

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import AntdSpin, { AntdMess } from "./Antd";
import { useCart } from "../Context/CartContext";
import { getProducts } from "../Context/getProducts";
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import ProductCard from "./ProductCard";
import Seo, { SITE_URL } from "./Seo";
import { formatPrice, formatCategory } from "../utils/format";
import { optimizedImageUrl } from "../utils/imageOptimization";
import "./ProductDetail.css";
import ImageMagnifier from "./ImageMagnifier";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const actionsRef = useRef(null);
    // Mobile buy bar: shown while the inline action buttons are off screen,
    // hidden as soon as they are visible (no duplicated buttons).
    const [showBuyBar, setShowBuyBar] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setQuantity(1);
            setRelatedProducts([]);
            try {
                const snap = await getDoc(doc(db, "products", id));
                if (snap.exists()) {
                    const data = snap.data();
                    setProduct({ id: snap.id, ...data });
                    // Use itemImages[0].url if available, else imageUrl, else null
                    const firstImage = data.itemImages?.find((img) => img?.url)?.url;
                    setCurrentImage(firstImage || data.imageUrl || null);

                    // "You may also like" — same category, in stock. Loaded in
                    // the background so it never delays the page.
                    getProducts()
                        .then((all) =>
                            setRelatedProducts(
                                all
                                    .filter(
                                        (item) =>
                                            Number(item.stock) > 0
                                            && item.id !== snap.id
                                            && (item.category || "other") === (data.category || "other")
                                    )
                                    .slice(0, 4)
                            )
                        )
                        .catch((error) => console.error("Related products failed:", error));
                } else {
                    setProduct(null);
                    setCurrentImage(null);
                    AntdMess({ type: "error", messageText: "Product not found" });
                }
            } catch (error) {
                console.error(error);
                AntdMess({ type: "error", messageText: "Failed to load product" });
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) return undefined;

        const actionsEl = actionsRef.current;
        if (!actionsEl || typeof IntersectionObserver === "undefined") {
            setShowBuyBar(true);
            return undefined;
        }

        const ctaObserver = new IntersectionObserver(([entry]) => {
            setShowBuyBar(!entry.isIntersecting);
        }, { threshold: 0.4 });

        ctaObserver.observe(actionsEl);
        return () => ctaObserver.disconnect();
    }, [product]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        AntdMess({ type: "success", messageText: `${product.productName} added to cart!` });
    };

    const handleBuyNow = () => {
        if (!product) return;
        addToCart(product, quantity);
        AntdMess({ type: "success", messageText: "Proceeding to checkout" });
        navigate("/cart");
    };

    const handleIncrement = () => {
        if (product && quantity < Number(product.stock)) {
            setQuantity((prev) => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    if (loading) {
        return (
            <AntdSpin tip="Loading product details..." />
        );
    }

    if (!product) {
        return (
            <>
                <Seo
                    title="Product Not Found"
                    path={`/product/${id}`}
                    robots="noindex, nofollow"
                />
                <Navbar />
                <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
                    <h1 className="h3 mb-3">Product not found</h1>
                    <p className="text-muted">
                        This product may have been removed or is temporarily unavailable.
                    </p>
                    <Link to="/products" className="btn btn-primary px-4">
                        Browse Products
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    // Prepare images array for gallery
    const images = (product.itemImages || [])
        .filter((img) => img?.url)
        .map((img) => img.url);
    if (images.length === 0 && product.imageUrl) {
        images.push(product.imageUrl);
    }

    const inStock = Number(product.stock) > 0;
    const stockCount = Number(product.stock) || 0;

    const sellPrice = Number(product.sellPrice) || 0;
    const delPrice = Number(product.delPrice) || 0;

    const whatsappOrderLink = `https://wa.me/923190609041?text=${encodeURIComponent(
        `Hi, I want to order: ${product.productName} (${SITE_URL}/product/${product.id})`
    )}`;

    const productJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                    { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: product.productName,
                        item: `${SITE_URL}/product/${product.id}`,
                    },
                ],
            },
            {
                "@type": "Product",
                name: product.productName,
                description:
                    product.descriptions ||
                    `Buy ${product.productName} online at Need Buy Store with fast delivery across Pakistan.`,
                image: images.map((img) => optimizedImageUrl(img, 1200)),
                sku: product.id,
                brand: { "@type": "Brand", name: "Need Buy" },
                offers: {
                    "@type": "Offer",
                    url: `${SITE_URL}/product/${product.id}`,
                    priceCurrency: "PKR",
                    price: sellPrice,
                    availability: inStock
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                    itemCondition: "https://schema.org/NewCondition",
                },
            },
        ],
    };

    return (
        <>
            <Seo
                title={product.productName}
                description={
                    product.descriptions ||
                    `Buy ${product.productName} online at Need Buy Store with fast delivery across Pakistan.`
                }
                path={`/product/${product.id}`}
                image={images[0] ? optimizedImageUrl(images[0], 1200) : undefined}
                type="product"
                jsonLd={productJsonLd}
            />
            <Navbar />
            <div className="container py-4 py-md-5" style={{ minHeight: "60vh" }}>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
                        {product.category && (
                            <li className="breadcrumb-item">
                                <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
                                    {formatCategory(product.category)}
                                </Link>
                            </li>
                        )}
                        <li className="breadcrumb-item active" aria-current="page">
                            {product.productName}
                        </li>
                    </ol>
                </nav>

                <div className="row">
                    {/* LEFT: IMAGE & GALLERY */}
                    <div className="col-md-6 mb-4">
                        <div className="border rounded shadow-sm mb-3 d-flex justify-content-center align-items-center bg-white product-detail-media">
                            {currentImage ? (
                                <ImageMagnifier
                                    src={optimizedImageUrl(currentImage, 1200)}
                                    alt={product.productName}
                                />
                            ) : (
                                <p>No Image Available</p>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="d-flex gap-2 justify-content-center overflow-auto">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`border rounded p-1 cursor-pointer ${currentImage === img ? 'border-primary' : 'border-light'}`}
                                        style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                                        onClick={() => setCurrentImage(img)}
                                    >
                                        <img
                                            src={optimizedImageUrl(img, 200)}
                                            className="img-fluid w-100 h-100 object-fit-cover"
                                            alt={`${product.productName} thumbnail ${index + 1}`}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="col-md-6 text-start product-detail-details">
                        <h1 className="h2 fw-bold">{product.productName}</h1>

                        <div className="my-3">
                            {product.rating && (
                                <span className="badge bg-warning text-dark me-2">
                                    ⭐ {product.rating}
                                </span>
                            )}
                            <span className={`badge ${inStock ? "bg-success" : "bg-danger"}`}>
                                {inStock ? "In Stock" : "Out of Stock"}
                            </span>
                            {inStock && stockCount <= 5 && (
                                <span className="badge bg-danger ms-2">
                                    Only {stockCount} left
                                </span>
                            )}
                        </div>

                        <p className="text-muted">{product.descriptions}</p>

                        <div className="d-flex align-items-end gap-3 mb-4">
                            <h2 className="h3 mb-0 text-primary">
                                {formatPrice(product.sellPrice)}
                            </h2>
                            {delPrice > 0 && delPrice > sellPrice && (
                                <>
                                    <del className="text-muted fs-5">
                                        {formatPrice(product.delPrice)}
                                    </del>
                                    <span className="badge bg-danger fs-6">
                                        Save {formatPrice(delPrice - sellPrice)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="d-flex flex-wrap align-items-center mb-4">
                            <span className="me-3 fw-bold">Quantity:</span>
                            <div className="btn-group" role="group">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={handleDecrement}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="btn btn-outline-secondary disabled fw-bold text-dark px-4">{quantity}</span>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={handleIncrement}
                                    disabled={quantity >= stockCount}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                            <span className="ms-3 text-muted small">
                                {stockCount} items available
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-3" ref={actionsRef}>
                            <button
                                className="btn btn-primary px-4 py-2"
                                onClick={handleAddToCart}
                                disabled={!inStock}
                            >
                                <i className="fa-solid fa-cart-shopping me-2"></i>
                                Add to Cart
                            </button>
                            <button
                                className="btn btn-success px-4 py-2"
                                onClick={handleBuyNow}
                                disabled={!inStock}
                            >
                                <i className="fa-solid fa-bolt me-2"></i>
                                Buy Now
                            </button>
                        </div>

                        {!inStock && (
                            <div className="alert alert-danger mt-3">
                                This product is currently out of stock.
                            </div>
                        )}

                        {/* Trust row */}
                        <div className="d-flex flex-wrap align-items-center gap-3 mt-4 pt-3 border-top text-muted small">
                            <span><i className="fa-solid fa-money-bill-wave me-1 text-success" aria-hidden="true"></i>Cash on Delivery</span>
                            <span><i className="fa-solid fa-truck-fast me-1 text-primary" aria-hidden="true"></i>Fast Delivery</span>
                            <span><i className="fa-solid fa-circle-check me-1 text-success" aria-hidden="true"></i>Quality Checked</span>
                            <a
                                href={whatsappOrderLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-success text-decoration-none fw-semibold"
                            >
                                <i className="fa-brands fa-whatsapp me-1" aria-hidden="true"></i>
                                Order on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-5 pt-3 border-top">
                        <h2 className="h4 fw-bold mb-4">You may also like</h2>
                        <div className="row g-3">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Mobile buy bar — pinned while the product info is off screen */}
                <div className={`mobile-buy-bar d-md-none ${showBuyBar ? "" : "mobile-buy-bar-hidden"}`}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="flex-shrink-0 lh-sm">
                            <div className="fw-bold fs-5 text-primary">{formatPrice(sellPrice)}</div>
                            {delPrice > sellPrice && sellPrice > 0 && (
                                <del className="text-muted small">{formatPrice(delPrice)}</del>
                            )}
                        </div>
                        <div className="d-flex gap-2 flex-grow-1 justify-content-end">
                            <button
                                className="btn btn-primary flex-grow-1"
                                onClick={handleAddToCart}
                                disabled={!inStock}
                            >
                                <i className="fa-solid fa-cart-shopping me-1" aria-hidden="true"></i>
                                Add to Cart
                            </button>
                            <button
                                className="btn btn-success flex-grow-1"
                                onClick={handleBuyNow}
                                disabled={!inStock}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetail;

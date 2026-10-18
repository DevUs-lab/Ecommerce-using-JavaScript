import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import AntdSpin, { AntdMess } from "./Antd";
import { useCart } from "../Context/CartContext";
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import Seo, { SITE_URL } from "./Seo";
import { formatPrice } from "../utils/format";
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

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setQuantity(1);
            try {
                const snap = await getDoc(doc(db, "products", id));
                if (snap.exists()) {
                    const data = snap.data();
                    setProduct({ id: snap.id, ...data });
                    // Use itemImages[0].url if available, else imageUrl, else null
                    const firstImage = data.itemImages?.find((img) => img?.url)?.url;
                    setCurrentImage(firstImage || data.imageUrl || null);
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
                    price: Number(product.sellPrice) || 0,
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
            <div className="container py-5" style={{ minHeight: "60vh" }}>
                <div className="row">
                    {/* LEFT: IMAGE & GALLERY */}
                    <div className="col-md-6 mb-4">
                        <div className="border rounded shadow-sm mb-3 d-flex justify-content-center align-items-center bg-white" style={{ minHeight: '400px' }}>
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
                    <div className="col-md-6 text-start">
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
                        </div>

                        <p className="text-muted">{product.descriptions}</p>

                        <div className="d-flex align-items-end gap-3 mb-4">
                            <h2 className="h3 mb-0 text-primary">
                                {formatPrice(product.sellPrice)}
                            </h2>
                            {Number(product.delPrice) > 0 && (
                                <del className="text-muted fs-5">
                                    {formatPrice(product.delPrice)}
                                </del>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="d-flex align-items-center mb-4">
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
                                    disabled={quantity >= Number(product.stock)}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                            <span className="ms-3 text-muted small">
                                {Number(product.stock) || 0} items available
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-3">
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
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetail;

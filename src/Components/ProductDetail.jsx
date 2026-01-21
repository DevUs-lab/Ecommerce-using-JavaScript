import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Spin, message } from "antd";
import { useCart } from "../Context/CartContext";
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
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
            try {
                const snap = await getDoc(doc(db, "products", id));
                if (snap.exists()) {
                    const data = snap.data();
                    setProduct({ id: snap.id, ...data });
                    // Use itemImages[0].url if available, else imageUrl, else empty
                    const initialImage = data.itemImages && data.itemImages.length > 0
                        ? data.itemImages[0].url
                        : data.imageUrl;
                    setCurrentImage(initialImage);
                } else {
                    message.error("Product not found");
                }
            } catch (error) {
                console.error(error);
                message.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        message.success(`${product.productName} added to cart!`);
    };

    const handleBuyNow = () => {
        if (!product) return;
        addToCart(product, quantity);
        message.success("Proceeding to checkout");
        navigate("/cart");
    };

    const handleIncrement = () => {
        if (product && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center min-vh-100">
                <Spin size="large" />
            </div>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="container py-5 text-center min-vh-100">
                    <h2>Product not found</h2>
                </div>
                <Footer />
            </>
        );
    }

    // Prepare images array for gallery
    const images = product.itemImages && product.itemImages.length > 0
        ? product.itemImages.map(img => img.url)
        : [product.imageUrl];

    return (
        <>
            <Navbar />
            <div className="container py-5 min-vh-100">
                <div className="row">
                    {/* LEFT: IMAGE & GALLERY */}
                    <div className="col-md-6 mb-4">
                        <div className="border rounded shadow-sm mb-3 d-flex justify-content-center align-items-center bg-white" style={{ minHeight: '400px' }}>
                            {currentImage ? (
                                <ImageMagnifier src={currentImage} />
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
                                            src={img}
                                            className="img-fluid w-100 h-100 object-fit-cover"
                                            alt={`thumbnail-${index}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="col-md-6 text-start">
                        <h2 className="fw-bold">{product.productName}</h2>

                        <div className="my-3">
                            <span className="badge bg-warning text-dark me-2">
                                ⭐ {product.rating || "4.5"}
                            </span>
                            <span className={`badge ${product.stock > 0 ? "bg-success" : "bg-danger"}`}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        <p className="text-muted">{product.descriptions}</p>

                        <div className="d-flex align-items-end gap-3 mb-4">
                            <h3 className="mb-0 text-primary">Rs {product.sellPrice}</h3>
                            {product.delPrice && (
                                <del className="text-muted">Rs {product.delPrice}</del>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="d-flex align-items-center mb-4">
                            <span className="me-3 fw-bold">Quantity:</span>
                            <div className="btn-group" role="group">
                                <button className="btn btn-outline-secondary" onClick={handleDecrement}>-</button>
                                <span className="btn btn-outline-secondary disabled fw-bold text-dark px-4">{quantity}</span>
                                <button className="btn btn-outline-secondary" onClick={handleIncrement}>+</button>
                            </div>
                            <span className="ms-3 text-muted small">{product.stock} items available</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-3">
                            <button
                                className="btn btn-primary px-4 py-2"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                            >
                                <i className="fa-solid fa-cart-shopping me-2"></i>
                                Add to Cart
                            </button>
                            <button
                                className="btn btn-success px-4 py-2"
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                            >
                                <i className="fa-solid fa-bolt me-2"></i>
                                Buy Now
                            </button>
                        </div>

                        {product.stock <= 0 && (
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

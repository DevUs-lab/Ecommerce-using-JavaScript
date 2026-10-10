import React from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { AntdMess } from './Antd';
import './productCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const quantity = 1;
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            AntdMess({ type: "error", messageText: "Out of stock" });
            return;
        }
        addToCart(product, quantity);
        AntdMess({ type: "success", messageText: "Item added to cart" });
    };

    const handleShopNow = () => {
        if (product.stock <= 0) {
            AntdMess({ type: "error", messageText: "Out of stock" });
            return;
        }
        addToCart(product, quantity);
        AntdMess({ type: "success", messageText: "Proceeding to checkout" });
        navigate('/cart');
    };

    const goToProduct = () => navigate(`/product/${product.id}`);

    return (
        <article className="mx-auto col-12 col-md-4 col-lg-3 mb-4">
            <div className="border shadow product-card">

                <div className="row g-0 align-items-center">

                    {/* IMAGE */}
                    <div
                        className="col-5 col-md-12"
                        onClick={goToProduct}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && goToProduct()}
                        aria-label={`View ${product.productName}`}
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="img-fluid product-image rounded"
                            loading="lazy"
                        />
                    </div>

                    {/* DETAILS */}
                    <div className="col-7 col-md-12">
                        <div className="p-2 p-md-3">

                            <h6
                                className="mb-1 fw-bold"
                                onClick={goToProduct}
                                style={{ cursor: 'pointer' }}
                            >
                                {product.productName}
                            </h6>

                            <p
                                onClick={goToProduct}
                                className="text-muted mb-1 d-none d-md-block product-description text-truncate"
                                style={{ maxWidth: "100%", cursor: 'pointer' }}
                            >
                                {product.descriptions}
                            </p>

                            <p
                                className="fw-bold mb-2"
                                onClick={goToProduct}
                                style={{ color: "#0097a7", cursor: 'pointer' }}
                            >
                                Rs {product.sellPrice}
                                {product.delPrice && (
                                    <del className="ms-2 text-muted">
                                        Rs {product.delPrice}
                                    </del>
                                )}
                            </p>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary btn-small w-50"
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                >
                                    Add to Cart
                                </button>

                                <button
                                    className="btn btn-success btn-small w-50"
                                    onClick={handleShopNow}
                                    disabled={product.stock <= 0}
                                >
                                    Buy Now
                                </button>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </article>
    );
};

export default ProductCard;

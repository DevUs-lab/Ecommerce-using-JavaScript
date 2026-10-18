import React from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { AntdMess } from './Antd';
import { formatPrice } from '../utils/format';
import { optimizedImageUrl } from '../utils/imageOptimization';
import './productCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const quantity = 1;
    const { addToCart } = useCart();

    const stock = Number(product.stock) || 0;
    const inStock = stock > 0;

    const sellPrice = Number(product.sellPrice) || 0;
    const delPrice = Number(product.delPrice) || 0;
    const discountPercent =
        delPrice > sellPrice && sellPrice > 0
            ? Math.round(((delPrice - sellPrice) / delPrice) * 100)
            : 0;

    const handleAddToCart = () => {
        if (!inStock) {
            AntdMess({ type: "error", messageText: "Out of stock" });
            return;
        }
        addToCart(product, quantity);
        AntdMess({ type: "success", messageText: "Item added to cart" });
    };

    const handleShopNow = () => {
        if (!inStock) {
            AntdMess({ type: "error", messageText: "Out of stock" });
            return;
        }
        addToCart(product, quantity);
        AntdMess({ type: "success", messageText: "Proceeding to checkout" });
        navigate('/cart');
    };

    const goToProduct = () => navigate(`/product/${product.id}`);

    return (
        <article className="col-12 col-md-4 col-lg-3 mb-4 d-flex">
            <div className="border shadow-sm product-card w-100 d-flex flex-column position-relative">

                {discountPercent > 0 && inStock && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2 z-1">
                        -{discountPercent}%
                    </span>
                )}

                <div className="row g-0 align-items-center flex-grow-1">

                    {/* IMAGE */}
                    <div
                        className="col-5 col-md-12 product-image-wrap"
                        onClick={goToProduct}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && goToProduct()}
                        aria-label={`View ${product.productName}`}
                    >
                        <img
                            src={optimizedImageUrl(product.imageUrl, 600)}
                            alt={product.productName}
                            className="img-fluid product-image rounded-top"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    {/* DETAILS */}
                    <div className="col-7 col-md-12 d-flex flex-column">
                        <div className="p-2 p-md-3 d-flex flex-column h-100">

                            <h3
                                className="h6 mb-1 fw-bold product-title"
                                onClick={goToProduct}
                                style={{ cursor: 'pointer' }}
                                title={product.productName}
                            >
                                {product.productName}
                            </h3>

                            <p
                                onClick={goToProduct}
                                className="text-muted mb-1 d-none d-md-block product-description text-truncate"
                                style={{ maxWidth: "100%", cursor: 'pointer' }}
                            >
                                {product.descriptions}
                            </p>

                            <p
                                className="fw-bold mb-2 mt-auto"
                                onClick={goToProduct}
                                style={{ color: "var(--nb-accent)", cursor: 'pointer' }}
                            >
                                {formatPrice(product.sellPrice)}
                                {delPrice > 0 && delPrice > sellPrice && (
                                    <del className="ms-2 text-muted fw-normal small">
                                        {formatPrice(product.delPrice)}
                                    </del>
                                )}
                            </p>

                            {inStock && stock <= 5 && (
                                <p className="small text-danger fw-semibold mb-2 d-none d-md-block">
                                    <i className="fa-solid fa-fire me-1" aria-hidden="true"></i>
                                    Only {stock} left!
                                </p>
                            )}

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary btn-small w-50"
                                    onClick={handleAddToCart}
                                    disabled={!inStock}
                                >
                                    Add to Cart
                                </button>

                                <button
                                    className="btn btn-success btn-small w-50"
                                    onClick={handleShopNow}
                                    disabled={!inStock}
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

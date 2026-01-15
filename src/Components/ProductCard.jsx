import React from 'react';
import { useCart } from '../Context/CartContext';
import { message } from 'antd';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        message.success(`${product.productName} added to cart`);
    };

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm border-0">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                        src={product.imageUrl}
                        className="card-img-top w-100 h-100"
                        alt={product.productName}
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{product.productName}</h5>
                    <p className="card-text text-muted small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.descriptions}
                    </p>
                    <div className="mb-2">
                        <span className="fw-bold fs-5">${product.sellPrice}</span>
                        {product.delPrice && (
                            <span className="text-muted text-decoration-line-through ms-2 small">
                                ${product.delPrice}
                            </span>
                        )}
                    </div>
                    <button
                        className="btn btn-primary w-100 mt-auto"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

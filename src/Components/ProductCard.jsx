import React from 'react';
import { useCart } from '../Context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
                <img src={product.image} className="card-img-top" alt={product.title} style={{ height: '200px', objectFit: 'contain', padding: '1rem' }} />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{product.title}</h5>
                    <p className="card-text text-muted description text-truncate">{product.description}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Rs {product.price}</span>
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

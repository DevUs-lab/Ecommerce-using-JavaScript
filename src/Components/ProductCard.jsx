import React from 'react';
import { useCart } from '../Context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
                <img src={product.image} className="card-img-top img-fluid" alt={product.title} style={{ height: '200px', objectFit: 'contain', padding: '1rem' }} />
                <div className="card-body d-flex flex-column">
                    <span className='ms-2 text-dark'><i className="fa-solid fa-star text-warning"></i></span>
                    <span className='ms-2 text-dark'><i className="fa-solid fa-star text-warning"></i></span>
                    <span className='ms-2 text-dark'><i className="fa-solid fa-star text-warning"></i></span>
                    <span className='ms-2 text-dark'><i className="fa-solid fa-star text-warning"></i></span>
                    <span className='ms-2 text-dark'><i className="fa-solid fa-star text-warning"></i></span>
                    <span className='ms-2 text-dark'><i className="fa-solid fa-star text-warning"></i></span>
                    <span className='ms-2 text-dark'><i className="fa-solid fa-star text-warning"></i></span>
                    <h5 className="card-title text-truncate">{product.title}</h5>
                    <p className="card-text text-muted description text-truncate">{product.description}</p>
                    <div className="mt-auto flex-column">
                        <span className="fw-bold">Rs {product.price}</span>
                        <span className='ms-3'><del>RS. {product.oldPrice}</del></span>
                        <div className='my-3 opacity-75'><b>Stock:</b><span className='text-success ms-2'><small>{product.stock}</small></span></div>
                        <div className='my-3'>
                            <div className='d-flex align-items-center border justify-content-between'>
                                <button className='btn px-3'>+</button>
                                <span className='mx-2'>1</span>
                                <button className='btn px-3' children="-" />
                            </div>
                        </div>
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

import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const Navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();


    console.log('product', product)

    const handleIncrement = () => {
        if (quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleShopNow = () => {
        addToCart(product, quantity);
        Navigate('/cart');
    };



    return (
        <div className="col-10 mx-auto col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className='border shadow'>

                <div className="">
                    <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="img-fluid"
                    />
                </div>

                <div className="mt-3 gap-2 pb-2 px-2">
                    <span className="">
                        Rating: {product.rating}
                    </span>
                    <span className="">
                        ⭐⭐⭐⭐⭐</span>

                    <h3 className="mt-2 text-wrap">
                        {product.productName}
                    </h3>

                    <p className="mt-2 fw-lighter text-wrap">
                        {product.descriptions}
                    </p>


                    <div className="mt-2 flex items-center gap-3">
                        <p className="text-lg font-bold text-sky-700">
                            Rs {product.sellPrice}
                            <del className='ms-3'> Rs {product.delPrice}</del>
                        </p>
                    </div>


                    <div className="mt-3 d-flex items-center justify-between text-sm mb-3">
                        {/* <span className="rounded bg-gray-100 px-2 py-1 text-gray-700 dark:bg-slate-700 dark:text-gray-200">
                        {product.category}
                        </span> */}

                        <span
                            className={`rounded px-2 py-1 
                            ${product.stock > 0 ? "bg-green-600" : "bg-red-600"
                                }`}
                        >
                            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                        </span>
                    </div>

                    <div className="mt-4 d-flex flex-column py-2 px-3 text-center">

                        <div className='border d-inline-block'>

                            <button className="ms-auto d-inline-block btn btn-outline-none bg-transparent rounded-0"
                                onClick={handleIncrement}
                            >
                                +
                            </button>
                            <span className=" px-3 px-md-4 px-lg-5" >{quantity}</span>
                            <button className="me-auto btn btn-outline-none bg-transparent rounded-0"
                                onClick={handleDecrement}
                            >
                                -
                            </button>
                        </div>

                        <div className="mt-4 d-flex align-items-center gap-2">
                            <button className="btn btn-primary w-auto" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                            <button className="btn btn-primary w-auto" onClick={handleShopNow}>
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default ProductCard;

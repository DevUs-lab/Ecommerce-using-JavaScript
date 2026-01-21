import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './productCard.css';

const ProductCard = ({ product }) => {
    const Navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    console.log('product', product)



    const handleAddToCart = () => {
        addToCart(product, quantity);
        message.success("Item added to cart");
    };

    const handleShopNow = () => {
        addToCart(product, quantity);
        message.success("Proceeding to checkout");
        Navigate('/cart');
    };



    return (
        <div className="mx-auto col-11 col-md-4 col-lg-3 mb-4" >
            <div className='border shadow'>

                <div
                    className="cursor-pointer"
                    onClick={() => Navigate(`/product/${product.id}`)}
                >
                    <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="img-fluid"
                    />
                </div>

                <div className="mt-2 gap-2 pb-2 px-2">



                    <h3 className="mt-1 text-wrap" onClick={() => Navigate(`/product/${product.id}`)}>
                        {product.productName}
                    </h3>

                    <p className="mb-1 fw-lighter text-wrap product-description">
                        {product.descriptions}
                    </p>


                    <div className="mb-1 flex items-center gap-3" onClick={() => Navigate(`/product/${product.id}`)}>
                        <p className="mb-0 text-lg font-bold text-sky-700">
                            Rs {product.sellPrice}
                            <del className='ms-3'> Rs {product.delPrice}</del>
                        </p>
                    </div>




                    <div className="d-flex flex-column pb-2 px-3 text-center">



                        <div className="d-flex w-100 gap-2 align-items-center justify-content-center">
                            <button className="btn btn-primary btn-small " onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                            <button className="btn btn-success btn-small " onClick={handleShopNow}>
                                Shop Now
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ProductCard;

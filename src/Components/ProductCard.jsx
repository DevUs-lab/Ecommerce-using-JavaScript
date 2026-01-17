import React from 'react';

const ProductCard = ({ product }) => {

    console.log('product', product)

    return (
        <div className="col-3">
            <div className='border px-3'>

                {/* Image */}
                <div className="flex justify-center">
                    <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="h-auto w-100 img-fluid object-cover"
                    />
                </div>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rating: {product.rating}
                    </span>
                    <span className="text-yellow-500">
                        ⭐⭐⭐⭐⭐</span>
                </div>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {product.descriptions}
                </p>

                {/* Name */}
                <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {product.productName}
                </h3>

                {/* Prices */}
                <div className="mt-2 flex items-center gap-3">
                    <p className="text-lg font-bold text-sky-700">
                        Rs {product.sellPrice}
                        <del className='ms-3'> Rs {product.delPrice}</del>
                    </p>
                </div>


                {/* Category + Stock */}
                <div className="mt-3 flex items-center justify-between text-sm">
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

                {/* Quantity Buttons */}
                <div className="mt-4 flex border text-center">


                    <button className=" btn btn-outline-dark bg-transparent px-4 rounded-0">
                        +
                    </button>
                    <span className=" px-5">1</span>
                    <button className="btn btn-outline-dark bg-transparent px-4 rounded-0">
                        -
                    </button>
                </div>

                {/* Add to Cart */}
                <div className="mt-4">
                    <button className="btn btn-primary w-100">
                        Add to Cart
                    </button>
                </div>

            </div>
        </div >
    );
};

export default ProductCard;

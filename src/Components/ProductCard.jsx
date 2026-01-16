import React from 'react';

const ProductCard = ({ product }) => {
    // Format price with proper currency formatting
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    // Fallback image in case the URL is invalid
    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/300x300/cccccc/969696?text=No+Image';
    };

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-blue-100">

                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-50">
                    <div className="aspect-square w-full">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/300x300/cccccc/969696?text=No+Image'}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    </div>

                    {/* Product Badge - Optional */}
                    {product.sellPrice > 200 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Premium
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-grow p-4">
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {product.productName}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                        {product.descriptions}
                    </p>

                    {/* Price Section */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatPrice(product.sellPrice)}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>

                            {/* Rating - Optional (if you have rating data) */}
                            {product.rating && (
                                <div className="flex items-center">
                                    <span className="text-yellow-400 mr-1">★</span>
                                    <span className="text-sm text-gray-700">{product.rating}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                                Add to Cart
                            </button>
                            <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
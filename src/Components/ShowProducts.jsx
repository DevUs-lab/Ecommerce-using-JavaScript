import React, { useEffect, useState } from 'react';
import { getProducts } from '../Context/CartContext';
import { Spin, message } from 'antd';
import ProductCard from './ProductCard';

const ShowProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error(error);
                message.error("Failed to load products");
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-5">All Products</h2>

            {loading && (
                <div className="d-flex justify-content-center p-5">
                    <Spin size="large" />
                </div>
            )}

            {!loading && products.length === 0 && (
                <div className="text-center p-5">
                    <p className="text-muted">No products found.</p>
                </div>
            )}

            <div className="row">
                {products.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default ShowProducts;
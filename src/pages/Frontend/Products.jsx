import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
import ProductCard from '../../Components/ProductCard';
import cardData from '../../api/cardData.json';
import CartModal from '../../Components/CartModal';

const Products = () => {
    const products = cardData.map(item => ({
        ...item,
        image: item.image.replace('./src/public/', '/')
    }));

    return (
        <>
            <Navbar />
            <CartModal />
            <main className="py-5 container">
                <h1 className="text-center mb-5">All Products</h1>
                <div className="row g-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Products;

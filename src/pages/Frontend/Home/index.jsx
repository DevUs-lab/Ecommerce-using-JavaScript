import React from 'react';
import Navbar from '../../../Components/Header/Navbar';
import Footer from '../../../Components/Footer/Footer';
import ProductCard from '../../../Components/ProductCard';
import cardData from '../../../api/cardData.json';
import CartModal from '../../../Components/CartModal';

const Home = () => {
    // Fix image paths from JSON to match public folder or import logic
    // Assuming images are in public/ directory at root for simplicity in this migration
    // or we need to handle the relative path. 
    // For now, removing './src/public/' prefix to point to root if they are in public
    // or assuming Vite will handle it if we move assets.
    const products = cardData.map(item => ({
        ...item,
        image: item.image.replace('./src/public/', '/')
    }));

    return (
        <>
            <Navbar />
            <CartModal />
            <main>
                <section className="hero">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 text-white">
                                <h1 className="display-4 fw-bold">Welcome to Umair Store</h1>
                                <p className="lead">Your one-stop shop for the best tech gadgets.</p>
                                <a href="#products" className="btn btn-light btn-lg rounded-0 text-dark fw-bold px-4">Shop Now</a>
                            </div>
                        </div>
                    </div>
                    <div className="custom-shape-divider-bottom-1766661423">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                        </svg>
                    </div>
                </section>

                <section id="products" className="py-5 container">
                    <h2 className="text-center mb-5">Featured Products</h2>
                    <div className="row g-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Home;

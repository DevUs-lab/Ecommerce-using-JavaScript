import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/Header/Navbar';
import Footer from '../../../Components/Footer/Footer';
import ProductCard from '../../../Components/ProductCard';
import CartModal from '../../../Components/CartModal';
import { getProducts } from '../../../Context/loginContext';
import { message, Spin } from 'antd';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);   // ✅ store in state
        } catch (error) {
            console.log(error);
            message.error("Failed to fetch products");
        }
        setLoading(false);
    };

    // ✅ fetch on page load
    useEffect(() => {
        fetchProducts();
    }, []);


    return (
        <>
            <Navbar />
            <CartModal />
            <main className='min-vh-100'>
                <section className="hero pb-2 pb-md-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 text-white">
                                <h1 className="display-4 fw-bold">Welcome to Umair Store</h1>
                                <p className="lead">Your one-stop shop for the best tech gadgets.</p>
                                <a href="#products" className="btn btn-light btn-lg rounded-0 text-dark fw-bold px-4">Shop Now</a>
                            </div>
                        </div>
                    </div>

                    <div className="custom-shape-divider-bottom-1768204145">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                        </svg>
                    </div>
                </section>

                <section id="products" className="py-5 container">
                    <h2 className="text-center mb-5">Featured Products</h2>

                    {loading && (
                        <div className="d-flex justify-content-center">
                            <Spin size="large" />
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="row g-4">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <p className="text-center">No products found</p>
                    )}
                </section>



            </main>
            <Footer />
        </>
    );
};

export default Home;

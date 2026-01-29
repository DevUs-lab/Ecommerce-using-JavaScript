import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/Header/Navbar';
import Footer from '../../../Components/Footer/Footer';
import ProductCard from '../../../Components/ProductCard';
// import CartModal from '../../../Components/CartModal';
import { getProducts } from '../../../Context/getProducts';
import { Spin } from 'antd';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});


    // ✅ fetch on page load
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                // console.log('data', data)
                const activeProducts = data.filter(product => product.stock > 0);
                setProducts(activeProducts);
            } catch (error) {
                console.log(error);
                AntdMess({ type: "error", messageText: "Failed to fetch products" });
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);


    return (
        <>
            <Navbar />
            {/* <CartModal /> */}
            <main className='min-h-screen'>
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

                <section id="products" className="py-12 px-4 mx-auto max-w-7xl">
                    <h2 className="mb-8 text-center text-3xl font-bold">
                        Featured Products
                    </h2>

                    {loading && (
                        <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "50vh" }}>
                            <Spin tip="Loading products..." />
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="container">

                            <div className="row">
                                {/* {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))} */}

                                {Object.entries(groupedProducts).map(([category, items]) => (
                                    <div key={category} className="mb-5 border-bottom pb-4">

                                        <h2 className="mb-4 text-capitalize text-center">
                                            {category.replace("-", " ")}
                                        </h2>

                                        <div className="row g-2 g-md-4">
                                            {items.map(product => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>

                                    </div>
                                ))}


                            </div>
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <p className="text-center">No products found</p>
                    )}
                </section>

                {/* Cart preview (shows Firestore-backed cart items when signed in) */}
                {/* <CartPreview /> */}

            </main>
            <Footer />
        </>
    );
};

// const CartPreview = () => {

//     return (
//         <section className="py-4 container">
//             <h3 className="mb-3">Your Cart</h3>
//             <div className="row">
//                 <div className="col-12">
//                     <div className="list-group">
//                         {/* {cart.map(item => (
//                             <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
//                                 <div className="d-flex align-items-center">
//                                     <img src={item.image} alt={item.title} style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 12 }} />
//                                     <div>
//                                         <div className="fw-bold">{item.title}</div>
//                                         <small className="text-muted">Rs {item.price} x {item.quantity}</small>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <span className="fw-bold">Rs {item.price * item.quantity}</span>
//                                 </div>
//                             </div>
//                         ))} */}
//                     </div>
//                     <div className="mt-3 d-flex justify-content-between align-items-center">
//                         {/* <strong>Total: Rs {cartTotal}</strong> */}
//                         <div>
//                             <button className="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#cartModal">View Cart</button>
//                             <a className="btn btn-sm btn-primary" href="/checkout">Checkout</a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

export default Home;

import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
// import CartModal from '../../Components/CartModal';
import ProductCard from '../../Components/ProductCard.jsx';
import { getProducts } from '../../Context/getProducts.jsx';
import { Spin } from 'antd';

const Products = () => {


    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        })();
    }, []);
    return (
        <>
            <Navbar />
            {/* <CartModal /> */}
            <div className="container min-h-screen py-12">

                <div className="row">
                    <section id="products" className="py-12 px-4 text-center mx-auto max-w-7xl">
                        <h2 className="mb-8 text-center mb-5 pb-5">
                            Featured Products
                        </h2>

                        {loading && (
                            <div className="d-flex mx-auto py-5 justify-content-center">
                                <Spin size="large" />
                            </div>
                        )}

                        {!loading && products.length > 0 && (
                            <div className="container">

                                <div className="row">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && products.length === 0 && (
                            <p className="text-center">No products found</p>
                        )}
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Products;

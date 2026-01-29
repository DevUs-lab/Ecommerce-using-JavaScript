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
            const activeProducts = data.filter(product => product.stock > 0);
            setProducts(activeProducts);
            setLoading(false);
        })();
    }, []);

    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});


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
                            <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "50vh" }}>
                                <Spin tip="Loading products..." />
                            </div>
                        )}


                        {!loading && products.length > 0 && (
                            <div className="container">

                                <div className="row">
                                    {Object.entries(groupedProducts).map(([category, items]) => (
                                        <div key={category} className="mb-5">

                                            <h2 className="mb-4 text-capitalize text-center">
                                                {category.replace("-", " ")}
                                            </h2>

                                            <div className="row">
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
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Products;

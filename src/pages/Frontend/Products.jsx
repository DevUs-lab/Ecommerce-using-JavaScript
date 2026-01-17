import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
// import CartModal from '../../Components/CartModal';
import ProductCard from '../../Components/ProductCard.jsx';
import { getProducts } from '../../Context/getProducts.jsx';

const Products = () => {


    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        async () => {
            const data = await getProducts();
            setProducts(data);
        }
    }, []);
    return (
        <>
            <Navbar />
            {/* <CartModal /> */}
            <div className="container min-h-screen py-12">

                <div className="row">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Products;

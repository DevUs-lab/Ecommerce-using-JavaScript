import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
// import CartModal from '../../Components/CartModal';
// import { getProducts } from '../../Context/CartContext';
import ShowProducts from '../../Components/ShowProducts.jsx';

const Products = () => {


    // const [products, setProducts] = React.useState([]);

    // React.useEffect(() => {
    //     async () => {
    //         const data = await getProducts();
    //         setProducts(data);
    //     }
    // }, []);
    return (
        <>
            <Navbar />
            {/* <CartModal /> */}
            <ShowProducts />
            <Footer />
        </>
    );
};

export default Products;

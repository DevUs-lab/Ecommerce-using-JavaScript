import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
import Seo from '../../Components/Seo';

const NotFound = () => {
    return (
        <>
            <Seo
                title="Page Not Found"
                path="/404"
                robots="noindex, nofollow"
            />
            <Navbar />
            <main
                className="d-flex flex-column align-items-center justify-content-center text-center"
                style={{ minHeight: '70vh' }}
            >
                <h1 className="display-1 fw-bold text-primary">404</h1>
                <h2 className="mb-3">Page Not Found</h2>
                <p className="text-muted mb-4">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary px-4">
                    Go to Home
                </Link>
            </main>
            <Footer />
        </>
    );
};

export default NotFound;

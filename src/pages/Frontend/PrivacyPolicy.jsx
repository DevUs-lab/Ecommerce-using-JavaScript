import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';

const PrivacyPolicy = () => {
    return (
        <>
            <Navbar />
            <div className="container py-5 min-h-screen">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <h1 className="text-center mb-5">Privacy Policy</h1>

                        <div className="card p-4 shadow-sm border-0">
                            <h4>1. Introduction</h4>
                            <p>
                                Welcome to <strong>Umair Store</strong>. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website.
                            </p>

                            <h4>2. Information We Collect</h4>
                            <p>
                                We may collect personal information such as your name, email address, phone number, and shipping address when you place an order or sign up for our newsletter. We also collect non-personal information like browser type and IP address for analytics purposes.
                            </p>

                            <h4>3. How We Use Your Information</h4>
                            <p>
                                We use your information to:
                            </p>
                            <ul>
                                <li>Process and fulfill your orders.</li>
                                <li>Communicate with you regarding updates, offers, and support.</li>
                                <li>Improve our website and customer experience.</li>
                                <li>Prevent fraudulent transactions.</li>
                            </ul>

                            <h4>4. Data Protection</h4>
                            <p>
                                We implement appropriate security measures to protect your personal data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.
                            </p>

                            <h4>5. Third-Party Sharing</h4>
                            <p>
                                We do not sell or rent your personal information to third parties. We may share data with trusted service providers (e.g., shipping companies, payment processors) strictly for fulfilling your orders.
                            </p>

                            <h4>6. Cookies</h4>
                            <p>
                                Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some site functionalities.
                            </p>

                            <h4>7. Changes to This Policy</h4>
                            <p>
                                We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with a revised date.
                            </p>

                            <h4>8. Contact Us</h4>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at support@umairstore.com.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;

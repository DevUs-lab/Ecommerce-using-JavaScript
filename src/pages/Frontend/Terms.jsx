import React from 'react';
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/Header/Navbar';

const Terms = () => {
    return (
        <>
            <Navbar />
            <div className="container py-5 min-h-screen">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <h1 className="text-center mb-5">Terms & Conditions</h1>

                        <div className="card p-4 shadow-sm border-0">
                            <h4>1. Introduction</h4>
                            <p>
                                These Terms and Conditions govern your use of <strong>Need Buy Store</strong>. By accessing or using our website, you agree to be bound by these terms. If you disagree with any part of these terms, please do not use our services.
                            </p>

                            <h4>2. Products and Pricing</h4>
                            <p>
                                All products listed on our store are subject to availability. We strive to display accurate pricing and product descriptions, but errors may occur. We reserve the right to correct any errors and to change prices at any time without notice.
                            </p>

                            <h4>3. Orders and Payments</h4>
                            <p>
                                When you place an order, you agree to provide current, complete, and accurate purchase and account information. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase.
                            </p>

                            <h4>4. Shipping and Delivery</h4>
                            <p>
                                We act as a facilitator to ship products to you. Delivery times are estimates and start from the date of shipping, rather than the date of order. We are not responsible for delays caused by the shipping carrier or customs clearance.
                            </p>

                            <h4>5. Returns and Refunds</h4>
                            <p>
                                Please review our Return Policy in the FAQ section. Items must be returned in their original condition. Refunds will be processed to the original method of payment within a certain amount of days.
                            </p>

                            <h4>6. Intellectual Property</h4>
                            <p>
                                The content, layout, design, data, databases and graphics on this website are protected by intellectual property laws. You may not reproduce, download, transmit or redistribute any content without our written permission.
                            </p>

                            <h4>7. Limitation of Liability</h4>
                            <p>
                                To the fullest extent permitted by law, Need Buy Store shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                            </p>

                            <h4>8. Changes to Terms</h4>
                            <p>
                                We reserve the right to replace or modify these Terms & Conditions at any time. It is your responsibility to check this page periodically for changes.
                            </p>

                            <h4>9. Governing Law</h4>
                            <p>
                                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Need Buy Store operates, without regard to its conflict of law provisions.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Terms;

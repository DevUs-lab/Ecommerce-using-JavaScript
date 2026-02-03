import React from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';

const FAQs = () => {
    return (
        <>
            <Navbar />
            <div className="container py-5 min-h-screen">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h1 className="text-center mb-5">Frequently Asked Questions</h1>

                        <div className="accordion" id="faqAccordion">

                            {/* Question 1 */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        What products do you sell?
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        At <strong>Need Buy Store</strong>, we specialize in best tech gadgets, including smartphones, accessories, smartwatches, and audio devices. We ensure high quality and genuine products for all our customers.
                                    </div>
                                </div>
                            </div>

                            {/* Question 2 */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        How can I track my order?
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Once your order is shipped, we will send you a tracking number via email or SMS. You can use this number to track your package on our delivery partner's website.
                                    </div>
                                </div>
                            </div>

                            {/* Question 3 */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        What is your return policy?
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        We offer a 7-day return policy for defective or damaged items. Please ensure the product is in its original packaging with all accessories included. Contact our support team to initiate a return.
                                    </div>
                                </div>
                            </div>

                            {/* Question 4 */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingFour">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                        Do you offer cash on delivery (COD)?
                                    </button>
                                </h2>
                                <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Yes, we offer Cash on Delivery (COD) services for most locations. You can pay for your order when it arrives at your doorstep.
                                    </div>
                                </div>
                            </div>

                            {/* Question 5 */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingFive">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                        How long does delivery take?
                                    </button>
                                </h2>
                                <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Standard delivery typically takes 3-5 business days depending on your location. We strive to process and ship orders as quickly as possible.
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default FAQs;

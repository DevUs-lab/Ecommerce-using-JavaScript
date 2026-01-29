import React, { useState } from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
import { AntdMess } from '../../Components/Antd';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import emailjs from "emailjs-com"
// import CartModal from '../../Components/CartModal';

const Contact = () => {

    const [sending, setSending] = useState(false); // Simulate success or failure  

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            // 1️⃣ Send email using EmailJS
            await emailjs.send(
                "Ecommerce",
                "template_e0guznj",
                {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    title: "New Contact Message",
                },
                "dUe6ginQueaDP1o7m"
            );


            // 2️⃣ Save message in Firebase
            await addDoc(collection(db, "contacts"), {
                ...formData,
                createdAt: Timestamp.now()
            });

            AntdMess({ type: "success", messageText: "Message sent successfully!" });
            setFormData({ name: '', email: '', message: '' });

        } catch (error) {
            console.error("Error:", error);
            AntdMess({ type: "error", messageText: "Failed to send message" });

        }

        setSending(false);
    }

    return (
        <>
            <Navbar />
            {/* <CartModal /> */}
            <main className="py-5">
                <div className="container">
                    <h1 className="text-center mb-5">Contact Us</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" name='name' value={formData.name} onChange={handleChange} id="name" placeholder="Your Name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" name='email' value={formData.email} onChange={handleChange} id="email" placeholder="Your Email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea className="form-control" id="message" name='message' value={formData.message} rows="5" onChange={handleChange} placeholder="Your Message"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">{sending ? "Sending..." : "Send Message"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Contact;

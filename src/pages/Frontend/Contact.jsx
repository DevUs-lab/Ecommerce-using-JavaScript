import React, { useState } from 'react';
import Navbar from '../../Components/Header/Navbar';
import Footer from '../../Components/Footer/Footer';
import Seo from '../../Components/Seo';
import { AntdMess } from '../../Components/Antd';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import emailjs from "emailjs-com"

const CONTACT_CARDS = [
    {
        icon: "fa-brands fa-whatsapp",
        title: "WhatsApp",
        text: "Fastest way to reach us",
        href: "https://wa.me/923190609041",
        linkText: "0319-0609041",
    },
    {
        icon: "fa-solid fa-envelope",
        title: "Email",
        text: "We reply within a few hours",
        href: "mailto:umairdevus@gmail.com",
        linkText: "umairdevus@gmail.com",
    },
    {
        icon: "fa-solid fa-truck-fast",
        title: "Delivery",
        text: "Nationwide, 2–5 working days",
        href: null,
        linkText: "Cash on Delivery available",
    },
];

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

        // Honeypot: bots fill this hidden field, humans don't.
        if (e.target.website.value) {
            AntdMess({ type: "success", messageText: "Message sent successfully!" });
            setFormData({ name: '', email: '', message: '' });
            setSending(false);
            return;
        }

        // 1️⃣ Always save the message to Firestore first, so it is never lost
        //    even when the email service has a problem.
        let savedInDatabase = false;
        try {
            await addDoc(collection(db, "contacts"), {
                ...formData,
                read: false,
                createdAt: Timestamp.now()
            });
            savedInDatabase = true;
        } catch (error) {
            console.error("Failed to save contact message:", error);
        }

        // 2️⃣ Then try to email it via EmailJS. A failure here is logged but
        //    does not lose the message — it is already in the admin panel.
        const emailReady = Boolean(
            import.meta.env.VITE_EMAILJS_SERVICE_ID
            && import.meta.env.VITE_EMAILJS_TEMPLATE_ID
            && import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        let emailed = false;
        if (emailReady) {
            try {
                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    {
                        name: formData.name,
                        email: formData.email,
                        message: formData.message,
                        title: "New Contact Message",
                    },
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );
                emailed = true;
            } catch (error) {
                console.error("Failed to email contact message:", error);
            }
        } else {
            console.warn("EmailJS environment variables are missing — message saved to Firestore only.");
        }

        if (savedInDatabase || emailed) {
            AntdMess({ type: "success", messageText: "Message sent successfully! We'll get back to you soon." });
            setFormData({ name: '', email: '', message: '' });
        } else {
            AntdMess({ type: "error", messageText: "Failed to send message. Please try again or contact us on WhatsApp." });
        }

        setSending(false);
    }

    return (
        <>
            <Seo
                title="Contact Us"
                description="Questions about an order, delivery, returns or a product? Contact Need Buy Store by email or WhatsApp — we reply quickly."
                path="/contact"
            />
            <Navbar />
            <main className="py-5">
                <div className="container">
                    <h1 className="text-center mb-2">Contact Us</h1>
                    <p className="text-center text-muted mb-5">
                        Questions about an order, a product, delivery or returns? We're happy to help.
                    </p>

                    {/* Contact options */}
                    <div className="row g-3 justify-content-center mb-5">
                        {CONTACT_CARDS.map((card) => (
                            <div className="col-md-4" key={card.title}>
                                <div className="card h-100 border-0 shadow-sm text-center p-4">
                                    <i className={`${card.icon} fa-2x mb-3 text-primary`} aria-hidden="true"></i>
                                    <h2 className="h5 mb-1">{card.title}</h2>
                                    <p className="text-muted small mb-2">{card.text}</p>
                                    {card.href ? (
                                        <a
                                            href={card.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="fw-semibold text-decoration-none"
                                        >
                                            {card.linkText}
                                        </a>
                                    ) : (
                                        <span className="fw-semibold text-muted">{card.linkText}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                                <h2 className="h5 mb-4 text-center">Send us a message</h2>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input required type="text" className="form-control" name='name' value={formData.name} onChange={handleChange} id="name" placeholder="Your Name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input required type="email" className="form-control" name='email' value={formData.email} onChange={handleChange} id="email" placeholder="Your Email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea required className="form-control" id="message" name='message' value={formData.message} rows="5" onChange={handleChange} placeholder="Your Message"></textarea>
                                </div>
                                {/* Honeypot field — hidden from humans, catches spam bots */}
                                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                                    <label htmlFor="website">Website</label>
                                    <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={sending}>{sending ? "Sending..." : "Send Message"}</button>
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

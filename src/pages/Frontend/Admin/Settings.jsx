import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../../firebase/config';
import AntdSpin, { AntdMess } from '../../../Components/Antd';

const Settings = () => {
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [onlinePaymentDiscount, setOnlinePaymentDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [saved, setSaved] = useState({ deliveryCharge: 0, onlinePaymentDiscount: 0 });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "globalSettings", "storeInfo");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDeliveryCharge(docSnap.data().deliveryCharge || 0);
                    setOnlinePaymentDiscount(docSnap.data().onlinePaymentDiscount || 0);
                    setSaved({
                        deliveryCharge: docSnap.data().deliveryCharge || 0,
                        onlinePaymentDiscount: docSnap.data().onlinePaymentDiscount || 0
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                AntdMess({ type: "error", messageText: "Failed to load settings" });
            } finally {
                setFetching(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = doc(db, "globalSettings", "storeInfo");
            await setDoc(docRef, {
                deliveryCharge: Number(deliveryCharge),
                onlinePaymentDiscount: Number(onlinePaymentDiscount)
            }, { merge: true });
            setSaved({
                deliveryCharge: Number(deliveryCharge),
                onlinePaymentDiscount: Number(onlinePaymentDiscount)
            });
            AntdMess({ type: "success", messageText: "Settings saved successfully" });
        } catch (error) {
            console.error("Error saving settings:", error);
            AntdMess({ type: "error", messageText: "Failed to save settings" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <AntdSpin fullscreen size="large" />;

    const isDirty = Number(deliveryCharge) !== Number(saved.deliveryCharge)
        || Number(onlinePaymentDiscount) !== Number(saved.onlinePaymentDiscount);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h4 className="mb-0">Store Settings</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSave}>
                                <div className="mb-3">
                                    <label className="form-label">Delivery Charge (Rs)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={deliveryCharge}
                                        onChange={(e) => setDeliveryCharge(e.target.value)}
                                        min="0"
                                    />
                                    <div className="form-text">This amount will be added to the cart total.</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Online Payment Discount (Rs)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={onlinePaymentDiscount}
                                        onChange={(e) => setOnlinePaymentDiscount(e.target.value)}
                                        min="0"
                                    />
                                    <div className="form-text">This discount will be applied for online payment methods like EasyPaisa, JazzCash, and Bank Transfer.</div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading || !isDirty}>
                                    {loading ? "Saving..." : isDirty ? "Save Settings" : "Saved"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
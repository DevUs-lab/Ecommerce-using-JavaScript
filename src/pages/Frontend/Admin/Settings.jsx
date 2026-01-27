import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../../firebase/config';
import { AntdMess } from '../../../Components/Antd';

const Settings = () => {
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "globalSettings", "storeInfo");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDeliveryCharge(docSnap.data().deliveryCharge || 0);
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
            await setDoc(docRef, { deliveryCharge: Number(deliveryCharge) }, { merge: true });
            AntdMess({ type: "success", messageText: "Settings saved successfully" });
        } catch (error) {
            console.error("Error saving settings:", error);
            AntdMess({ type: "error", messageText: "Failed to save settings" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-5">Loading settings...</div>;

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
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Saving..." : "Save Settings"}
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
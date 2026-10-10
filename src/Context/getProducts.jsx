import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
    }
};

// Firebase configuration
// Values come from environment variables — see `.env.example`.
// Locally: copy `.env.example` to `.env` and fill in your real values.
// On Vercel: add the same variables in Project → Settings → Environment Variables.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const REQUIRED_KEYS = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
];

// The Firebase web config is baked in at build time. If the environment
// variables are missing (e.g. they were not set on the hosting provider),
// calling initializeApp()/getAuth() throws and the whole page goes blank.
// So we detect that case up front and let the app show a clear message.
export const isFirebaseConfigured = REQUIRED_KEYS.every(
    (key) => Boolean(firebaseConfig[key])
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    console.error(
        "Firebase config is missing. Locally, create a `.env` file (see `.env.example`). " +
        "On Vercel, add the VITE_FIREBASE_* variables in Project → Settings → Environment " +
        "Variables and redeploy."
    );
}

export { app, auth, db };

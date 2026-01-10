import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const logoutLink = document.getElementById("logout-link");

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User logged in
        loginLink?.classList.add("d-none");
        registerLink?.classList.add("d-none");
        logoutLink?.classList.remove("d-none");
    } else {
        // User logged out
        loginLink?.classList.remove("d-none");
        registerLink?.classList.remove("d-none");
        logoutLink?.classList.add("d-none");
    }
});

// Logout click
logoutLink?.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "./login.html";
});

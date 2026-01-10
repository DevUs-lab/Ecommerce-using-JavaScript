import { showNotification } from "./main.js";
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email) {
        showNotification("Email is required", "error");
        return;
    }

    if (!password) {
        showNotification("Password is required", "error");
        return;
    }

    if (!email.includes("@")) {
        showNotification("Enter a valid email", "error");
        return;
    }

    const button = form.querySelector("button");

    try {
        button.disabled = true;
        button.textContent = "Logging in...";

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("user", userCredential.user);

        showNotification("Login successful. Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "./index.html";
        }, 1500);
    } catch (error) {
        let message = "Login failed. Please try again.";

        if (error.code === "auth/user-not-found") {
            message = "No account found with this email.";
        } else if (error.code === "auth/wrong-password") {
            message = "Incorrect password.";
        } else if (error.code === "auth/invalid-credential") {
            message = "Invalid email or password.";
        } else if (error.code === "auth/network-request-failed") {
            message = "Network error. Check your internet connection.";
        }

        showNotification(message, "error");

        button.disabled = false;
        button.textContent = "Login";
    }
});

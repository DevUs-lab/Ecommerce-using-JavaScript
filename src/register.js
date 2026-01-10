

import { showNotification } from "./main.js";
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form["confirm-password"].value;

    if (!email) {
        showNotification("Email is required");
        return;
    }

    if (!password) {
        showNotification("Password is required");
        return;
    }

    if (!confirmPassword) {
        showNotification("Confirm Password is required");
        return;
    }

    if (!email.includes("@")) {
        showNotification("Enter a valid email");
        return;
    }

    if (password.length < 6) {
        showNotification("Password must be at least 6 characters long");
        return;
    }

    if (password !== confirmPassword) {
        showNotification("Passwords do not match");
        return;
    }
    const button = form.querySelector("button");

    try {

        button.disabled = true;
        button.textContent = "Registering...";

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);


        const user = userCredential.user;
        console.log('user', user);
        showNotification('Registration successful. Redirecting to login...');
        // Give the notification a short moment to appear before redirecting
        setTimeout(() => {
            window.location.href = './login.html';
        }, 1500);
    } catch (error) {
        console.log('error', error)
        console.log('error', error.message)

        let message = error?.message || 'Registration failed. Please try again.';
        const type = 'error';

        if (message.includes('already-in-use')) {
            message = 'This email is already registered. Please use a different email or login.';
        } else if (message.includes('invalid-email')) {
            message = 'The email address is not valid. Please enter a valid email.';
        } else if (message.includes('network-request-failed')) {
            message = 'Network error. Please check your internet connection and try again.';
        }

        // Show a single consolidated notification for errors
        showNotification(message, type);

        button.disabled = false;
        button.textContent = "Register";

    }
}
)



import { showNotification } from "./addToCart.js";
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form["confirm-password"].value;

    if (!email) {
        alert("Email is required");
        return;
    }

    if (!password) {
        alert("Password is required");
        return;
    }

    if (!confirmPassword) {
        alert("Confirm Password is required");
        return;
    }

    if (!email.includes("@")) {
        alert("Enter a valid email");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
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
        window.location.href = './login.html';
    } catch (error) {
        console.log('error', error)
        console.log('error', error.message)
        console.log('error', error.message.includes('already-in-use'))

        if (error.message.includes('already-in-use')) {
            showNotification('This email is already registered. Please use a different email or login.');
        }
        if (error.message.includes('invalid-email')) {
            showNotification('The email address is not valid. Please enter a valid email.');
        }
        if (error.message.includes('network-request-failed')) {
            // alert('Network error. Please check your internet connection and try again.');
            showNotification('Network error. Please check your internet connection and try again.', 'error');
        }
        // alert(error?.message || 'Registration failed. Please try again.');
        showNotification(error.message)

        button.disabled = false;
        button.textContent = "Register";

    }
}
)

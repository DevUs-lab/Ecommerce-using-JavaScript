

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

    try {

        const button = form.querySelector("button");
        button.disabled = true;
        button.textContent = "Registering...";

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);


        const user = userCredential.user;
        console.log('user', user);
        alert('Registration successful. Redirecting to login...');
        window.location.href = './login.html';
    } catch (error) {
        console.log('error', error)
        // Show a clearer error message to the user
        alert(error?.message || 'Registration failed. Please try again.');
    }
}
)

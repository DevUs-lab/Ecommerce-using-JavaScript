// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import product from './api/cardData.json'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { showProductContainer } from "./homeProducts";
import { addToCart, setupCartModal, renderCartPage } from "./addToCart";
import './firebase.js';
import './authState.js';
const $ = document.querySelectorAll("#mainNav .nav-link");
console.log('$', $)
window.addEventListener("load", () => {

    $.forEach(link => {
        link.addEventListener("click", e => {
            $.forEach(item => item.classList.remove('active'));

            // add active to clicked one
            link.classList.add('active');
        })
    });

    setupCartModal();

    if (document.getElementById('cart-page-container')) {
        renderCartPage();
    }

});


const $$ = (select) => document.querySelector(select);


// console.log('product', product)

if (document.getElementById('products')) {
    showProductContainer(product);
}



// Show Ant Design-like Notification
export const showNotification = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const iconClass = type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.innerHTML = `
    <i class="${iconClass}" aria-hidden="true"></i>
    <span>${message}</span>
  `;

    container.appendChild(toast);

    // Trigger animation reliably
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
};
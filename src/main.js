// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import product from './api/cardData.json'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { showProductContainer } from "./homeProducts";
import { addToCart, setupCartModal, renderCartPage } from "./addToCart";
import './firebase.js';
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

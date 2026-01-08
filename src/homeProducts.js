
const $$ = (select) => document.querySelector(select);
import { addToCart } from "./addToCart";


console.log($$("#products"))

export const showProductContainer = (products) => {
    const template = document.querySelector("#productTemplate");
    const card = document.querySelector("#products");

    if (!template || !card) return;

    console.log('products', products)

    products.forEach(element => {
        const clone = template.content.cloneNode(true);
        console.log('clone', clone)

        // clone.querySelector("#cardId").id = element.id;
        clone.querySelector(".card-wrapper").dataset.id = element.id;



        clone.querySelector(".category").textContent = element.category;
        clone.querySelector(".product-name").textContent = element.name;
        clone.querySelector(".product-img").src = element.image;
        clone.querySelector(".description").textContent = element.description;
        clone.querySelector(".final-price").textContent = element.price;
        clone.querySelector(".old-price").textContent = element.oldPrice;
        clone.querySelector(".stock").textContent = element.stock;


        const qtyEl = clone.querySelector(".quantity");
        const incBtn = clone.querySelector(".increment");
        const decBtn = clone.querySelector(".decrement");

        let qty = 1

        incBtn.addEventListener("click", () => {
            qty++;
            qtyEl.textContent = qty;
        });

        decBtn.addEventListener("click", () => {
            if (qty > 1) {
                qty--;
                qtyEl.textContent = qty;
            }
        });

        const addToCartBtn = clone.querySelector(".add-to-cart-btn");
        addToCartBtn.addEventListener("click", () => {
            addToCart(element, qty);
        });

        card.appendChild(clone)
    });


}
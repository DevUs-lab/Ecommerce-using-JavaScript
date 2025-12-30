
const $$ = (select) => document.querySelector(select);


console.log($$("#products"))

const template = $$("#productTemplate")
const card = $$("#products")
export const showProductContainer = (products) => {

    console.log('products', products)

    products.forEach(element => {
        const clone = template.content.cloneNode(true);
        console.log('clone', clone)

        clone.querySelector(".category").textContent = element.category;
        clone.querySelector(".product-name").textContent = element.name;
        clone.querySelector(".product-img").src = element.image;
        clone.querySelector(".description").textContent = element.description;
        clone.querySelector(".final-price").textContent = element.price;
        clone.querySelector(".old-price").textContent = element.oldPrice;
        clone.querySelector(".stock").textContent = element.stock;
        card.appendChild(clone)

    });


}
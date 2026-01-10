
import * as bootstrap from 'bootstrap';
import { showNotification } from './main';

// Helper to get cart from local storage
export const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
};

// Helper to save cart
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Update the cart count in the navbar
export const updateCartCount = () => {
    const cart = getCart();
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const countElement = document.getElementById('count');
    if (countElement) {
        countElement.textContent = totalCount;
    }
};

// Initial update on load
document.addEventListener('DOMContentLoaded', updateCartCount);


export function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    saveCart(cart);
    updateCartCount();
    showNotification(`${product.name} added to cart`);
}

// Render Cart Items in Modal
export const renderCart = () => {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');

    if (!container || !totalElement) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'd-flex align-items-center justify-content-between border-bottom pb-2';
            div.innerHTML = `
        <div class="d-flex align-items-center gap-3">
            <img src="${item.image}" alt="${item.name}" class="rounded" width="50" height="50" style="object-fit: cover;">
            <div>
                <h6 class="mb-0 text-truncate" style="max-width: 150px;">${item.name}</h6>
                <small class="text-muted">Rs ${item.price} x ${item.quantity}</small>
            </div>
            <div class="d-flex align-items-center border rounded">
                    <button class="btn btn-sm btn-light px-2 page-decrement" data-index="${index}">-</button>
                    <span class="px-2" style="min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button class="btn btn-sm btn-light px-2 page-increment" data-index="${index}">+</button>
                 </div>
        </div>
        <div class="d-flex align-items-center gap-3">
             <span class="fw-bold">Rs ${itemTotal}</span>
             <button class="btn btn-sm btn-danger remove-btn" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
             </button>
        </div>
      `;
            container.appendChild(div);
        });
    }

    totalElement.textContent = total;

    // Attach remove listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Handle icon click bubbling
            const index = e.target.closest('button').dataset.index;
            removeFromCart(index);
        });
    });
};

// Remove item from cart
export const removeFromCart = (index) => {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    renderCart(); // Re-render logic
};

// Setup Modal Trigger
export const setupCartModal = () => {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            renderCart();
            const modal = new bootstrap.Modal(document.getElementById('cartModal'));
            modal.show();
        });
    }
}

// Render Cart on dedicated Page
export const renderCartPage = () => {
    const cart = getCart();
    const container = document.getElementById('cart-page-container');
    const subtotalEl = document.getElementById('summary-subtotal');
    const totalEl = document.getElementById('summary-total');

    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fa-solid fa-cart-shopping mb-3 display-1 text-muted opacity-25"></i>
                <h4 class="text-muted">Your cart is empty</h4>
                <a href="/" class="btn btn-primary mt-3 rounded-0">Start Shopping</a>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = 'Rs 0';
        if (totalEl) totalEl.textContent = 'Rs 0';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'd-flex align-items-center justify-content-between p-3 border-bottom';
        div.innerHTML = `
            <div class="d-flex align-items-center gap-3" style="flex: 1;">
                <img src="${item.image}" alt="${item.name}" class="rounded border" width="80" height="80" style="object-fit: cover;">
                <div>
                    <h6 class="mb-1 text-dark fw-semibold">${item.name}</h6>
                    <small class="text-muted">Rs ${item.price}</small>
                </div>
            </div>
            
            <div class="d-flex align-items-center gap-3">
                 <div class="d-flex align-items-center border rounded">
                    <button class="btn btn-sm btn-light px-2 page-decrement" data-index="${index}">-</button>
                    <span class="px-2" style="min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button class="btn btn-sm btn-light px-2 page-increment" data-index="${index}">+</button>
                 </div>
                 <div class="fw-bold text-end" style="min-width: 80px;">Rs ${itemTotal}</div>
                 <button class="btn btn-sm text-danger page-remove-btn" data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                 </button>
            </div>
      `;
        container.appendChild(div);
    });

    if (subtotalEl) subtotalEl.textContent = `Rs ${total}`;
    if (totalEl) totalEl.textContent = `Rs ${total}`;

    // Attach listeners for Page controls
    container.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const index = parseInt(target.dataset.index);

        if (target.classList.contains('page-remove-btn')) {
            removeFromCart(index);
            renderCartPage();
        }

        if (target.classList.contains('page-increment')) {
            cart[index].quantity++;
            saveCart(cart);
            updateCartCount();
            renderCartPage();
        }

        if (target.classList.contains('page-decrement')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                saveCart(cart);
                updateCartCount();
                renderCartPage();
            }
        }
    });

};

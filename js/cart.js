// Cart is a client-side order-request builder (a shopping list), not a
// completed purchase. No payment, account, or server order is created here.

import { readJSON, writeJSON } from "./storage.js";

const CART_KEY = "triangleCoatingsCart";

export function getCart() {
  const cart = readJSON(CART_KEY, []);
  return Array.isArray(cart) ? cart.filter((i) => i && i.name && typeof i.price === "number") : [];
}

export function saveCart(cart) {
  writeJSON(CART_KEY, cart);
  renderCart();
}

export function getCartCount(cart = getCart()) {
  return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

export function getCartTotal(cart = getCart()) {
  return cart.reduce((total, item) => total + (item.quantity || 0) * (item.price || 0), 0);
}

export function addItem({ name, price, quantity = 1 }) {
  const cart = getCart();
  const existing = cart.find((item) => item.name === name);
  if (existing) existing.quantity += quantity;
  else cart.push({ name, price, quantity });
  saveCart(cart);
}

export function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

export function updateCartCounters() {
  document.querySelectorAll("[data-cart-count]").forEach((counter) => {
    counter.textContent = String(getCartCount());
  });
}

export function renderCart() {
  const cart = getCart();
  const cartItems = document.querySelector(".cart-items");
  const empty = document.querySelector(".cart-empty");
  const total = document.querySelector("[data-cart-total]");

  updateCartCounters();

  if (!cartItems || !empty || !total) return;

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
    <div class="cart-line">
      <div><strong>${escapeHtml(item.name)}</strong><br><span>${item.quantity} &times; $${item.price.toFixed(2)}</span></div>
      <button type="button" class="cart-remove" data-remove-cart="${index}" aria-label="Remove ${escapeHtml(item.name)} from request">Remove</button>
    </div>`
    )
    .join("");

  empty.hidden = cart.length > 0;
  total.textContent = `$${getCartTotal(cart).toFixed(2)}`;
}

export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function initCart() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      addItem({ name: button.dataset.name, price: Number(button.dataset.price) });
      const original = button.dataset.label || button.textContent;
      button.dataset.label = original;
      button.textContent = "Added to request";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1100);
    });
  });

  document.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-cart]");
    if (!removeButton) return;
    removeItem(Number(removeButton.dataset.removeCart));
  });

  renderCart();
}

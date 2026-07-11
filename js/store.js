// Store catalog: filtering, sorting, and honest order-request checkout.
// The cart is a request builder; "checkout" prepares an email order request
// to a real Triangle Coatings inbox. No payment or server order occurs here.

import { getCart, getCartCount, getCartTotal } from "./cart.js";
import { buildMailto, announce } from "./util.js";

const ORDER_EMAIL = "orders@tricoat.com";

function categoryLabel(filter) {
  const map = {
    all: "All Products",
    artist: "Artist Oils",
    decorative: "Decorative Coatings",
    concrete: "Concrete Sealers",
    industrial: "Industrial Coatings",
    tubtile: "Tub & Tile Coatings",
    architectural: "Architectural Coatings",
  };
  return map[filter] || "Products";
}

function initFilters() {
  const filterButtons = document.querySelectorAll(".store-filters button[data-filter]");
  const cards = document.querySelectorAll(".store-card");
  if (!filterButtons.length || !cards.length) return;

  const countEl = document.querySelector("[data-store-count]");
  const statusEl = document.querySelector("[data-store-status]");
  const emptyEl = document.querySelector("[data-store-empty]");

  function applyFilter(filter, { updateUrl = true } = {}) {
    let visible = 0;
    filterButtons.forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    cards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (countEl) countEl.textContent = String(visible);
    if (emptyEl) emptyEl.hidden = visible > 0;
    announce(statusEl, `${visible} product${visible === 1 ? "" : "s"} shown in ${categoryLabel(filter)}.`);

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (filter === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", filter);
      window.history.replaceState({}, "", url);
    }
  }

  filterButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.classList.contains("active") ? "true" : "false");
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  const initial = new URLSearchParams(window.location.search).get("category");
  const hasInitial = initial && [...filterButtons].some((b) => b.dataset.filter === initial);
  applyFilter(hasInitial ? initial : "all", { updateUrl: false });
}

function initSort() {
  const sort = document.querySelector(".sort-products");
  const grid = document.querySelector(".store-grid");
  if (!sort || !grid) return;

  sort.addEventListener("change", (event) => {
    const cards = Array.from(grid.children);
    const value = event.target.value;
    if (value !== "featured") {
      cards.sort((a, b) => {
        const first = Number(a.querySelector(".add-to-cart")?.dataset.price || 0);
        const second = Number(b.querySelector(".add-to-cart")?.dataset.price || 0);
        return value === "price-asc" ? first - second : second - first;
      });
    }
    cards.forEach((card) => grid.appendChild(card));
  });
}

function initCheckout() {
  const modal = document.querySelector(".checkout-modal");
  const openButton = document.querySelector(".checkout-button");
  if (!modal || !openButton) return;

  const message = modal.querySelector(".checkout-message");
  let lastActive = null;

  openButton.addEventListener("click", () => {
    if (!getCartCount()) {
      if (message) message.textContent = "";
      window.alert("Your request list is empty. Add a product before requesting an order.");
      return;
    }
    lastActive = document.activeElement;
    if (message) message.textContent = "";
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  });

  modal.addEventListener("close", () => {
    if (lastActive && typeof lastActive.focus === "function") lastActive.focus();
  });

  modal.querySelector(".show-guest")?.addEventListener("click", () => {
    const form = modal.querySelector(".guest-form");
    if (form) {
      form.hidden = false;
      form.querySelector("input, textarea")?.focus();
    }
  });

  modal.querySelector(".submit-order-request")?.addEventListener("click", () => {
    const form = modal.querySelector(".guest-form");
    if (form && !form.reportValidity?.()) return;

    const data = new FormData(form || undefined);
    const cart = getCart();
    const lines = [
      "Order request from the Triangle Coatings website.",
      "This is a request for pricing and availability, not a completed purchase.",
      "",
      "Requested items:",
      ...cart.map((i) => `  - ${i.quantity} x ${i.name} (list $${i.price.toFixed(2)} each)`),
      "",
      `Estimated list subtotal: $${getCartTotal(cart).toFixed(2)} (before tax and shipping)`,
      "",
      "Contact details:",
      `  Name: ${(data.get("firstName") || "")} ${(data.get("lastName") || "")}`.trim(),
      data.get("email") ? `  Email: ${data.get("email")}` : "",
      data.get("phone") ? `  Phone: ${data.get("phone")}` : "",
      data.get("address") ? `  Ship to: ${data.get("address")}` : "",
    ];
    const href = buildMailto(ORDER_EMAIL, "Website Order Request", lines);
    window.location.href = href;
    if (message) {
      message.textContent =
        "Your email application should open with your order request addressed to " +
        ORDER_EMAIL +
        ". A specialist will confirm pricing, availability, tax, and shipping. No payment is processed online.";
    }
  });
}

export function initStore() {
  initFilters();
  initSort();
  initCheckout();
}

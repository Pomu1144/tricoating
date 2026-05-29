const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navGroups = document.querySelectorAll(".nav-group");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const prevButton = document.querySelector(".slider-control--prev");
const nextButton = document.querySelector(".slider-control--next");
const dotsContainer = document.querySelector(".slider-dots");
const cartKey = "triangleCoatingsCart";
const userKey = "triangleCoatingsUser";
let activeSlide = 0;
let slideTimer;

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  renderCart();
}

function getCartCount(cart = getCart()) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal(cart = getCart()) {
  return cart.reduce((total, item) => total + item.quantity * item.price, 0);
}

function updateCartCounters() {
  document.querySelectorAll("[data-cart-count]").forEach((counter) => {
    counter.textContent = getCartCount();
  });
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.querySelector(".cart-items");
  const empty = document.querySelector(".cart-empty");
  const total = document.querySelector("[data-cart-total]");

  updateCartCounters();

  if (!cartItems || !empty || !total) return;

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-line">
      <div><strong>${item.name}</strong><br><span>${item.quantity} × $${item.price.toFixed(2)}</span></div>
      <button type="button" data-remove-cart="${index}">Remove</button>
    </div>
  `).join("");

  empty.hidden = cart.length > 0;
  total.textContent = `$${getCartTotal(cart).toFixed(2)}`;
}

function setSlide(index) {
  if (!slides.length || !dotsContainer) return;
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });

  dotsContainer.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
    dot.setAttribute("aria-pressed", String(dotIndex === activeSlide));
  });
}

function startSlider() {
  if (!slides.length) return;
  clearInterval(slideTimer);
  slideTimer = setInterval(() => setSlide(activeSlide + 1), 6500);
}

function advanceSlide(step) {
  setSlide(activeSlide + step);
  startSlider();
}

if (dotsContainer && slides.length) {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dot.addEventListener("click", () => {
      setSlide(index);
      startSlider();
    });
    dotsContainer.appendChild(dot);
  });

  prevButton?.addEventListener("click", () => advanceSlide(-1));
  nextButton?.addEventListener("click", () => advanceSlide(1));
  setSlide(0);
  startSlider();
}

menuToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navGroups.forEach((group) => {
  const button = group.querySelector("button");
  button.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 820px)").matches) {
      navGroups.forEach((otherGroup) => {
        if (otherGroup !== group) otherGroup.classList.remove("is-open");
      });
      group.classList.toggle("is-open");
    }
  });
});

document.querySelectorAll(".primary-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const cart = getCart();
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const existing = cart.find((item) => item.name === name);

    if (existing) existing.quantity += 1;
    else cart.push({ name, price, quantity: 1 });

    saveCart(cart);
    button.textContent = "Added";
    setTimeout(() => { button.textContent = "Add to Cart"; }, 900);
  });
});

document.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-cart]");
  if (!removeButton) return;

  const cart = getCart();
  cart.splice(Number(removeButton.dataset.removeCart), 1);
  saveCart(cart);
});

document.querySelectorAll(".store-filters button[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".store-filters button[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".store-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

const initialCategory = new URLSearchParams(window.location.search).get("category");
if (initialCategory) {
  document.querySelector(`.store-filters button[data-filter="${initialCategory}"]`)?.click();
}

document.querySelector(".sort-products")?.addEventListener("change", (event) => {
  const grid = document.querySelector(".store-grid");
  if (!grid) return;

  const cards = Array.from(grid.children);
  if (event.target.value !== "featured") {
    cards.sort((a, b) => {
      const first = Number(a.querySelector(".add-to-cart").dataset.price);
      const second = Number(b.querySelector(".add-to-cart").dataset.price);
      return event.target.value === "price-asc" ? first - second : second - first;
    });
  }
  cards.forEach((card) => grid.appendChild(card));
});

const checkoutModal = document.querySelector(".checkout-modal");
document.querySelector(".checkout-button")?.addEventListener("click", () => {
  if (!getCartCount()) {
    alert("Your cart is empty. Please add an item before checkout.");
    return;
  }

  const user = localStorage.getItem(userKey);
  const message = document.querySelector(".checkout-message");
  if (user && message) {
    message.textContent = "You are logged in. Review your cart and place your order with saved account details.";
  }
  checkoutModal?.showModal();
});

document.querySelector(".show-guest")?.addEventListener("click", () => {
  const guestForm = document.querySelector(".guest-form");
  if (guestForm) guestForm.hidden = false;
});

document.querySelector(".place-order")?.addEventListener("click", () => {
  const message = document.querySelector(".checkout-message");
  if (message) message.textContent = "Thank you. Your guest checkout details were received and a confirmation email will be sent.";
  saveCart([]);
});

document.querySelector(".login-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get("email");
  localStorage.setItem(userKey, JSON.stringify({ email }));
  event.currentTarget.querySelector(".form-note").textContent = `Logged in as ${email}. You can now return to the store checkout.`;
});

document.querySelector(".order-lookup-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get("lookupEmail");
  const result = document.querySelector(".order-lookup-result");
  if (result) result.textContent = `We found the lookup request for ${email}. A confirmation link would be emailed in production.`;
});

renderCart();

document.querySelectorAll(".lead-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector(".lead-form-message");
    if (message) {
      message.textContent = "Thanks — a Triangle Coatings specialist will review your project details and follow up shortly.";
    }
    form.reset();
  });
});


const safetySearch = document.querySelector(".safety-search");
const safetyCards = Array.from(document.querySelectorAll(".sheet-card"));
const safetyCount = document.querySelector("[data-safety-count]");
const noSheetsMessage = document.querySelector("[data-no-sheets]");

function updateSafetyLookup() {
  if (!safetyCards.length) return;

  const query = safetySearch?.value.trim().toLowerCase() || "";
  let visibleCount = 0;

  safetyCards.forEach((card) => {
    const text = `${card.dataset.sheetText || ""} ${card.textContent}`.toLowerCase();
    const isVisible = !query || text.includes(query);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (safetyCount) safetyCount.textContent = String(visibleCount);
  if (noSheetsMessage) noSheetsMessage.hidden = visibleCount !== 0;
}

safetySearch?.addEventListener("input", updateSafetyLookup);
safetySearch?.form?.addEventListener("reset", () => {
  window.setTimeout(updateSafetyLookup, 0);
});
updateSafetyLookup();

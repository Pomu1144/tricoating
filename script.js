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

const coatingAssistantKnowledge = [
  {
    id: "bathroom",
    project: "Bathroom / tub / tile / sink / porcelain refinishing",
    keys: ["bathroom", "tub", "tile", "sink", "shower", "porcelain", "reglazing", "ceramic"],
    productName: "Liquid Porcelain™ Tub & Tile Kit",
    unitPrice: 129,
    recommendation: "Use the Tub & Tile / Liquid Porcelain reglazing line for ceramic tile, porcelain tubs, sinks, and bathroom fixtures. These systems are built for refinishing hard bathroom surfaces after proper cleaning, repair, and prep.",
    safety: "Danger level: High. Many reglazing systems use flammable solvents and may use activators such as 249B with isocyanate hazards. Use strong ventilation, goggles, chemical-resistant gloves, and the respirator guidance in the safety sheets."
  },
  {
    id: "wood",
    project: "Wood cabinets, trim, doors, and furniture",
    keys: ["wood", "trim", "cabinet", "door", "furniture"],
    productName: "DuraKote™ Exterior Acrylic",
    unitPrice: 64,
    recommendation: "For wood, choose an architectural or industrial primer/topcoat based on whether it is interior, exterior, decorative, or heavy-use. Confirm whether the surface is bare wood, previously painted, or stained so Triangle can match the primer.",
    safety: "Danger level: Moderate to High depending on solvent content. Sanding dust and solvent vapors require eye protection, gloves, and ventilation."
  },
  {
    id: "concrete",
    project: "Concrete, masonry, pavers, and stone",
    keys: ["concrete", "garage", "floor", "patio", "masonry", "stone", "paver", "countertop"],
    productName: "Water Based Concrete Sealer",
    unitPrice: 42.5,
    recommendation: "Use the Concrete Sealer / White Mountain line for concrete floors, countertops, pavers, masonry, and stone. Pick penetrating, water-based, high-gloss, or slip-resistant options based on the final look and traffic.",
    safety: "Danger level: Moderate unless using high-solvent sealers. Keep ignition sources away, ventilate, and avoid skin/eye contact."
  },
  {
    id: "industrial",
    project: "Industrial metal, equipment, marine, OEM, and maintenance coatings",
    keys: ["industrial", "metal", "equipment", "marine", "oem", "maintenance", "antenna", "steel", "aluminum"],
    productName: "Low VOC Industrial Enamel",
    unitPrice: 78,
    recommendation: "Use the Industrial Coating line for metal, equipment, marine, OEM, antenna, and maintenance work. These jobs often need substrate-specific primers and performance requirements such as corrosion resistance or government specs.",
    safety: "Danger level: High for many industrial coatings because of flammability and solvent exposure. Use explosion-proof ventilation where needed and review the SDS before spraying."
  },
  {
    id: "decorative",
    project: "Decorative coatings and specialty effects",
    keys: ["decorative", "metallic", "patina", "rust", "effect", "finish", "chemical dye", "dye", "dying"],
    productName: "Decorative Coating Project Kit",
    unitPrice: 49,
    recommendation: "Use Decorative Coating products for metallic, patina, rust, chemical-dye style effects, and architectural finishes on paintable surfaces. Best selection depends on indoor/outdoor exposure and desired finish.",
    safety: "Danger level: Low to Moderate for many decorative applications, but check the exact sheet for solvents, pigments, and ventilation needs."
  },
  {
    id: "architectural",
    project: "General purpose architectural painting/coating",
    keys: ["wall", "house", "architectural", "interior", "exterior", "siding", "general purpose", "general", "painting", "paint"],
    productName: "DuraKote™ Exterior Acrylic",
    unitPrice: 64,
    recommendation: "Use Architectural Coating products for interior/exterior walls, siding, and general-purpose building surfaces. Choose primer and finish by substrate, exposure, sheen, and VOC requirements.",
    safety: "Danger level: Low to Moderate for many architectural coatings, higher for solventborne or urethane systems. Follow label ventilation and PPE requirements."
  },
  {
    id: "artist",
    project: "Artist oils and fine-art surfaces",
    keys: ["artist", "oil", "canvas", "painting", "fine art"],
    productName: "Classic Artist Oils",
    unitPrice: 16.6,
    recommendation: "Use Classic Artist Oils for fine-art painting where heavy pigmentation, buttery texture, and consistent color are the priority.",
    safety: "Danger level: Low to Moderate. Avoid ingestion and prolonged skin contact, and keep solvent-soaked rags handled safely if reducers or cleaners are used."
  }
];

const productDangerNotes = [
  { keys: ["249b", "activator", "isocyanate"], text: "249B / Trilon S Activator danger level: Very High. It is flammable and has inhalation and skin-sensitization concerns. Use supplied-air respiratory protection when isocyanate levels are unknown or above limits, especially in confined spaces." },
  { keys: ["at78", "reducer", "acetone", "methyl acetate"], text: "AT78 reducer danger level: Very High. It is extremely flammable and can irritate eyes/skin, cause drowsiness, and present aspiration concerns." },
  { keys: ["961p700", "primer"], text: "961P700 TriCryl FD Primer danger level: High. It is highly flammable, can irritate skin/eyes, and is toxic to aquatic life." },
  { keys: ["249gfc700", "fc white"], text: "249GFC700 danger level: High. It is flammable, may cause drowsiness/dizziness, and is harmful to aquatic life." },
  { keys: ["249gfc900", "clear acrylic", "urethane"], text: "249GFC900 clear acrylic urethane danger level: High. It is flammable and can irritate skin/eyes, sensitize skin, and be harmful if inhaled." }
];

function normalizeChatText(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9. x/,-]/g, " ");
}

function getCoatingMatch(message) {
  const normalized = normalizeChatText(message);
  return coatingAssistantKnowledge.find((item) => item.keys.some((key) => normalized.includes(key)));
}

function getDangerMatch(message) {
  const normalized = normalizeChatText(message);
  return productDangerNotes.find((item) => item.keys.some((key) => normalized.includes(key)));
}

function parseProjectNumbers(text) {
  return Array.from(text.matchAll(/\d[\d,]*(?:\.\d+)?/g)).map((match) => ({
    value: Number(match[0].replace(/,/g, "")),
    index: match.index,
    raw: match[0]
  }));
}

function parseProjectQuantity(text, dimensionMatch) {
  if (dimensionMatch) {
    const beforeDimension = text.slice(0, dimensionMatch.index);
    const leadingQuantity = beforeDimension.match(/(?:i\s+have|have|need)?\s*(\d[\d,]*(?:\.\d+)?)\s*$/i);
    if (leadingQuantity) return Number(leadingQuantity[1].replace(/,/g, ""));
  }

  const quantityPatterns = [
    /(?:i\s+have|have|quantity|qty|count|need|for)\s+(\d[\d,]*(?:\.\d+)?)\s+(?:of\s+)?(?:those|these|them|garages?|tiles?|units?|rooms?|pieces?|surfaces?|areas?)\b/i,
    /(?:those|these|them)\s*(?:x|×|\*)\s*(\d[\d,]*(?:\.\d+)?)/i,
    /(\d[\d,]*(?:\.\d+)?)\s+(?:garages?|tiles?|units?|rooms?|pieces?|surfaces?|areas?)\b/i
  ];

  for (const pattern of quantityPatterns) {
    const match = text.match(pattern);
    if (!match) continue;
    if (dimensionMatch && match.index >= dimensionMatch.index && match.index < dimensionMatch.index + dimensionMatch[0].length) continue;
    return Number(match[1].replace(/,/g, ""));
  }

  return 1;
}

function calculateCoverage(message) {
  const normalized = normalizeChatText(message);
  const rawText = message.toLowerCase();
  const explicitArea = rawText.match(/(\d[\d,]*(?:\.\d+)?)\s*(?:sq\.?\s*ft|square\s*feet|sf)\b/);
  const dimensionMatch = rawText.match(/(\d[\d,]*(?:\.\d+)?)\s*(?:x|×|by)\s*(\d[\d,]*(?:\.\d+)?)(?:\s*(?:x|×|by)\s*(\d[\d,]*(?:\.\d+)?))?/i);
  const quantity = parseProjectQuantity(rawText, dimensionMatch);
  let area = explicitArea ? Number(explicitArea[1].replace(/,/g, "")) : 0;
  let areaLabel = explicitArea ? "provided surface area" : "surface area";
  let dimensionText = explicitArea ? explicitArea[1] : "";
  let dimensionUnit = explicitArea ? "sq ft" : "ft";

  if (dimensionMatch) {
    const length = Number(dimensionMatch[1].replace(/,/g, ""));
    const width = Number(dimensionMatch[2].replace(/,/g, ""));
    const height = dimensionMatch[3] ? Number(dimensionMatch[3].replace(/,/g, "")) : 0;
    if (height && /(room|wall|walls|height|lwh|l x w x h)/.test(normalized)) {
      area = 2 * (length + width) * height;
      areaLabel = "estimated wall area";
      dimensionText = `${length} × ${width} × ${height}`;
    } else {
      area = length * width;
      areaLabel = "estimated flat area";
      dimensionText = `${length} × ${width}`;
    }
  } else if (!area) {
    const numbers = parseProjectNumbers(rawText).map((number) => number.value);
    if (numbers.length >= 3 && /(room|wall|walls|height|lwh|l x w x h)/.test(normalized)) {
      const [length, width, height] = numbers;
      area = 2 * (length + width) * height;
      areaLabel = "estimated wall area";
      dimensionText = `${length} × ${width} × ${height}`;
    } else if (numbers.length >= 2) {
      area = numbers[0] * numbers[1];
      areaLabel = "estimated flat area";
      dimensionText = `${numbers[0]} × ${numbers[1]}`;
    } else if (numbers.length === 1) {
      area = numbers[0];
      areaLabel = "provided surface area";
      dimensionText = `${area}`;
      dimensionUnit = "sq ft";
    }
  }

  if (!area) return null;

  const totalArea = area * quantity;
  const coats = /one coat|1 coat/.test(normalized) ? 1 : 2;
  const coveragePerGallon = 325;
  const wasteFactor = 1.1;
  const gallonsEstimate = Math.ceil((totalArea * coats * wasteFactor) / coveragePerGallon * 10) / 10;
  const gallonsToOrder = Math.max(1, Math.ceil(gallonsEstimate));

  return { area: totalArea, singleArea: area, areaLabel, coats, gallonsEstimate, gallonsToOrder, dimensionText, dimensionUnit, quantity, coveragePerGallon };
}

function formatCoverage(coverage) {
  if (!coverage) return "";
  const quantityText = coverage.quantity > 1 ? ` across ${coverage.quantity.toLocaleString()} matching item${coverage.quantity === 1 ? "" : "s"}` : "";
  const perItemText = coverage.quantity > 1 ? ` (${Math.round(coverage.singleArea)} sq ft each)` : "";
  return `For ${coverage.dimensionText} ${coverage.dimensionUnit}${quantityText}, I estimate about ${Math.round(coverage.area).toLocaleString()} sq ft of ${coverage.areaLabel}${perItemText}. With ${coverage.coats} coat${coverage.coats > 1 ? "s" : ""}, 10% waste, and an assumed ${coverage.coveragePerGallon} sq ft/gallon coverage rate, plan for about ${coverage.gallonsEstimate.toLocaleString()} gallon${coverage.gallonsEstimate === 1 ? "" : "s"}. Exact coverage varies by surface porosity, spray loss, and product selection.`;
}

function createOrderSuggestion(profile, coverage, sourceText = "") {
  const gallons = coverage?.gallonsToOrder || 1;
  const total = Math.round(gallons * profile.unitPrice * 100) / 100;
  return {
    name: `AI Order: ${profile.productName} (${coverage ? `${coverage.gallonsEstimate} gal estimate` : profile.project})`,
    price: total,
    quantity: 1,
    productName: profile.productName,
    gallons,
    sourceText
  };
}

function addSuggestionToCart(suggestion) {
  if (!suggestion) return "I do not have an order ready yet. Tell me your project surface and dimensions first.";
  const cart = getCart();
  const existing = cart.find((item) => item.name === suggestion.name);
  if (existing) existing.quantity += 1;
  else cart.push({ name: suggestion.name, price: suggestion.price, quantity: suggestion.quantity });
  saveCart(cart);
  return `${suggestion.productName} was added to your cart as ${suggestion.gallons} gallon${suggestion.gallons === 1 ? "" : "s"} / kit${suggestion.gallons === 1 ? "" : "s"} for an estimated $${suggestion.price.toFixed(2)}. You can review it from the cart link.`;
}

function createAssistantResponse(message, lastSuggestion) {
  const normalized = normalizeChatText(message);
  const requestedCart = /add.*cart|cart.*add|buy that|order that/.test(normalized);
  if (requestedCart) {
    return { text: addSuggestionToCart(lastSuggestion), suggestion: null, options: ["Estimate another project", "Safety help"] };
  }

  if (/other project|something else|custom|other\b/.test(normalized)) {
    return {
      text: "Tell me the project type and surface area in one message. Example: ‘chemical dyeing on 250 sq ft concrete’ or ‘coating 10 x 12 wood cabinets.’",
      suggestion: null,
      options: ["Painting/coating", "Chemical dyeing", "Safety help"]
    };
  }

  const danger = getDangerMatch(message);
  const safetyOnly = /safety|ppe|danger|hazard|respirator|flammable|spill|fire|disposal|first aid/.test(normalized) && !/\d/.test(normalized);
  if (safetyOnly) {
    return {
      text: `${danger ? `${danger.text} ` : "I can help assess danger by product or surface. "}Minimum safety steps: keep away from ignition sources, ventilate, wear splash-rated eye protection and chemical-resistant gloves, and use the Safety/Data Sheets page for product-specific PPE, first aid, spill, fire, and disposal guidance.`,
      suggestion: null,
      options: ["Bathroom tile estimate", "Other project"]
    };
  }

  const profile = getCoatingMatch(message);
  const coverage = calculateCoverage(message);
  if (!profile && !coverage) {
    return {
      text: "What are you coating? You can type a short request like ‘bathroom tile 6x8’, ‘concrete garage 20x22’, ‘wood cabinets 120 sq ft’, or choose an option below.",
      suggestion: null,
      options: ["Bathroom tile estimate", "Concrete floor estimate", "Other project"]
    };
  }

  const selectedProfile = profile || coatingAssistantKnowledge.find((item) => item.id === "architectural");
  const coverageText = coverage ? `${formatCoverage(coverage)} ` : "Send dimensions or square footage and I can estimate gallons. ";
  const suggestion = createOrderSuggestion(selectedProfile, coverage, message);
  return {
    text: `${selectedProfile.project}: ${selectedProfile.recommendation} ${coverageText}${selectedProfile.safety} Would you like to add this to your cart?`,
    suggestion,
    options: ["Add to cart", "Change size", "Safety help"]
  };
}

function createAiChatbot() {
  const chatbot = document.createElement("aside");
  chatbot.className = "ai-chatbot";
  chatbot.setAttribute("aria-label", "AI coating order assistant");
  chatbot.innerHTML = `
    <button class="ai-chatbot__toggle" type="button" aria-expanded="false" aria-controls="ai-chatbot-panel">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9.4l-4.7 3.4A1 1 0 0 1 3 19.6V6a2 2 0 0 1 2-2Zm3 5.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>
      AI Order Help
    </button>
    <section class="ai-chatbot__panel" id="ai-chatbot-panel" aria-live="polite">
      <div class="ai-chatbot__header"><div><strong>Triangle AI Order Assistant</strong><span>Message-based order, coverage, and safety help</span></div><button class="ai-chatbot__close" type="button" aria-label="Close AI chat">×</button></div>
      <div class="ai-chatbot__messages"></div>
      <div class="ai-chatbot__options" aria-label="Suggested replies"></div>
      <form class="ai-chatbot__form"><input class="ai-chatbot__input" type="text" placeholder="Type your project, size, or ‘add to cart’..." aria-label="Ask the AI coating assistant" /><button class="ai-chatbot__send" type="submit">Send</button><p class="ai-chatbot__note">Guidance is for planning. Confirm product choice, SDS, and order details with Triangle Coatings.</p></form>
    </section>
  `;

  document.body.appendChild(chatbot);

  const toggle = chatbot.querySelector(".ai-chatbot__toggle");
  const close = chatbot.querySelector(".ai-chatbot__close");
  const messages = chatbot.querySelector(".ai-chatbot__messages");
  const options = chatbot.querySelector(".ai-chatbot__options");
  const form = chatbot.querySelector(".ai-chatbot__form");
  const input = chatbot.querySelector(".ai-chatbot__input");
  let lastSuggestion = null;

  function addMessage(text, fromUser = false) {
    const message = document.createElement("div");
    message.className = `ai-chatbot__message${fromUser ? " ai-chatbot__message--user" : ""}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function setOptions(nextOptions = []) {
    options.innerHTML = nextOptions.map((option) => `<button class="ai-chatbot__option" type="button">${option}</button>`).join("");
  }

  function runAssistant(text, fromOption = false) {
    const normalizedOption = normalizeChatText(text);
    const message = normalizedOption === "add to cart" ? "add that to my cart" : text;
    addMessage(text, true);
    const result = createAssistantResponse(message, lastSuggestion);
    if (result.suggestion) lastSuggestion = result.suggestion;
    addMessage(result.text);
    setOptions(result.options);
    if (!fromOption) input.value = "";
  }

  function setOpen(isOpen) {
    chatbot.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) window.setTimeout(() => input.focus({ preventScroll: true }), 80);
  }

  toggle.addEventListener("click", () => setOpen(!chatbot.classList.contains("is-open")));
  close.addEventListener("click", () => setOpen(false));
  options.addEventListener("click", (event) => {
    const option = event.target.closest(".ai-chatbot__option");
    if (!option) return;
    runAssistant(option.textContent, true);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    runAssistant(text);
  });

  addMessage("Hi — tell me what you’re coating and the size, like ‘bathroom tile 6x8’ or ‘concrete garage 20x22.’ I’ll estimate coverage, note safety concerns, and ask if you want it added to your cart.");
  setOptions(["Bathroom tile estimate", "Concrete floor estimate", "Other project"]);
}

createAiChatbot();

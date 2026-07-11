// Coating planning assistant. Provides non-authoritative planning guidance and
// rough coverage math only. It repeatedly directs users to the current product
// data sheet, SDS, and Triangle Coatings technical support, and never presents
// itself as a substitute for the official documentation.

import { getCart, saveCart } from "./cart.js";

const DISCLAIMER =
  "Product selection and coverage estimates must be confirmed with Triangle Coatings technical support and the current product data sheet. This assistant does not replace the Safety Data Sheet.";

const knowledge = [
  {
    id: "bathroom",
    project: "Bathroom / tub / tile / sink / porcelain refinishing",
    keys: ["bathroom", "tub", "tile", "sink", "shower", "porcelain", "reglazing", "ceramic"],
    productName: "Liquid Porcelain Tub & Tile Kit",
    unitPrice: 129,
    recommendation:
      "Consider the Tub & Tile / Liquid Porcelain reglazing line for ceramic tile, porcelain tubs, sinks, and fixtures after proper cleaning, repair, and prep.",
    safety:
      "Reglazing systems can use flammable solvents and activators with isocyanate hazards. Review the current SDS for ventilation, respiratory protection, and PPE before use.",
  },
  {
    id: "wood",
    project: "Wood cabinets, trim, doors, and furniture",
    keys: ["wood", "trim", "cabinet", "door", "furniture"],
    productName: "Architectural Primer/Topcoat System",
    unitPrice: 64,
    recommendation:
      "For wood, an architectural or industrial primer/topcoat is typically selected by interior/exterior use and substrate condition. Confirm whether the wood is bare, painted, or stained.",
    safety: "Sanding dust and solvent vapor call for eye protection, gloves, and ventilation per the product label and SDS.",
  },
  {
    id: "concrete",
    project: "Concrete, masonry, pavers, and stone",
    keys: ["concrete", "garage", "floor", "patio", "masonry", "stone", "paver", "countertop"],
    productName: "Water Based Concrete Sealer",
    unitPrice: 42.5,
    recommendation:
      "The Concrete Sealer line covers floors, countertops, pavers, masonry, and stone. Penetrating, water-based, high-gloss, and slip-resistant options are selected by finish and traffic.",
    safety: "Keep ignition sources away when using solvent sealers, ventilate, and avoid skin/eye contact per the SDS.",
  },
  {
    id: "industrial",
    project: "Industrial metal, equipment, marine, OEM, and maintenance coatings",
    keys: ["industrial", "metal", "equipment", "marine", "oem", "maintenance", "antenna", "steel", "aluminum"],
    productName: "Low VOC Industrial Enamel",
    unitPrice: 78,
    recommendation:
      "The Industrial Coating line serves metal, equipment, marine, OEM, and maintenance work, often with substrate-specific primers and performance requirements such as corrosion resistance.",
    safety: "Many industrial coatings are flammable. Use appropriate ventilation and review the SDS before spraying.",
  },
  {
    id: "decorative",
    project: "Decorative coatings and specialty effects",
    keys: ["decorative", "metallic", "patina", "rust", "effect", "finish", "dye"],
    productName: "Decorative Coating System",
    unitPrice: 49,
    recommendation:
      "Decorative Coating products create metallic, patina, and rust-style effects on paintable surfaces. Selection depends on indoor/outdoor exposure and desired finish.",
    safety: "Check the specific SDS for solvent, pigment, and ventilation requirements.",
  },
  {
    id: "architectural",
    project: "General-purpose architectural coating",
    keys: ["wall", "house", "architectural", "interior", "exterior", "siding", "general", "paint"],
    productName: "Architectural Coating System",
    unitPrice: 64,
    recommendation:
      "Architectural Coating products cover interior/exterior walls, siding, and building surfaces. Primer and finish are chosen by substrate, exposure, sheen, and VOC needs.",
    safety: "Follow label ventilation and PPE requirements, especially for solventborne or urethane systems.",
  },
  {
    id: "artist",
    project: "Artist oils and fine-art surfaces",
    keys: ["artist", "oil", "canvas", "fine art"],
    productName: "Classic Artist Oils",
    unitPrice: 16.6,
    recommendation:
      "Classic Artist Oils suit fine-art painting where heavy pigmentation and consistent color matter most.",
    safety: "Avoid ingestion and prolonged skin contact, and handle any solvent-soaked rags safely.",
  },
];

function normalize(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9. x/,-]/g, " ");
}

function matchProfile(message) {
  const n = normalize(message);
  return knowledge.find((item) => item.keys.some((key) => n.includes(key)));
}

function parseNumbers(text) {
  return Array.from(text.matchAll(/\d[\d,]*(?:\.\d+)?/g)).map((m) => Number(m[0].replace(/,/g, "")));
}

function calculateCoverage(message) {
  const normalized = normalize(message);
  const raw = message.toLowerCase();
  const explicit = raw.match(/(\d[\d,]*(?:\.\d+)?)\s*(?:sq\.?\s*ft|square\s*feet|sf)\b/);
  const dims = raw.match(/(\d[\d,]*(?:\.\d+)?)\s*(?:x|×|by)\s*(\d[\d,]*(?:\.\d+)?)(?:\s*(?:x|×|by)\s*(\d[\d,]*(?:\.\d+)?))?/i);

  let area = explicit ? Number(explicit[1].replace(/,/g, "")) : 0;
  let label = explicit ? "provided surface area" : "surface area";
  let dimensionText = explicit ? explicit[1] : "";
  let unit = explicit ? "sq ft" : "ft";

  if (dims) {
    const l = Number(dims[1].replace(/,/g, ""));
    const w = Number(dims[2].replace(/,/g, ""));
    const h = dims[3] ? Number(dims[3].replace(/,/g, "")) : 0;
    if (h && /(room|wall|walls|height)/.test(normalized)) {
      area = 2 * (l + w) * h;
      label = "estimated wall area";
      dimensionText = `${l} x ${w} x ${h}`;
    } else {
      area = l * w;
      label = "estimated flat area";
      dimensionText = `${l} x ${w}`;
    }
  } else if (!area) {
    const nums = parseNumbers(raw);
    if (nums.length >= 2) {
      area = nums[0] * nums[1];
      label = "estimated flat area";
      dimensionText = `${nums[0]} x ${nums[1]}`;
    } else if (nums.length === 1) {
      area = nums[0];
      label = "provided surface area";
      dimensionText = `${area}`;
      unit = "sq ft";
    }
  }

  if (!area) return null;
  const coats = /one coat|1 coat/.test(normalized) ? 1 : 2;
  const perGallon = 325;
  const gallons = Math.max(1, Math.ceil((area * coats * 1.1) / perGallon));
  return { area, label, coats, gallons, dimensionText, unit, perGallon };
}

function formatCoverage(c) {
  if (!c) return "";
  return `For ${c.dimensionText} ${c.unit}, that is roughly ${Math.round(c.area).toLocaleString()} sq ft of ${c.label}. Assuming ${c.coats} coat${c.coats > 1 ? "s" : ""}, 10% waste, and about ${c.perGallon} sq ft per gallon, plan for roughly ${c.gallons} gallon${c.gallons === 1 ? "" : "s"}. Confirm exact coverage with the product data sheet.`;
}

function buildResponse(message, lastSuggestion) {
  const n = normalize(message);

  if (/add.*(cart|request)|request that|order that/.test(n)) {
    if (!lastSuggestion) {
      return { text: "Tell me your project surface and size first, then I can prepare a request.", options: ["Bathroom tile estimate", "Concrete floor estimate"] };
    }
    const cart = getCart();
    const existing = cart.find((i) => i.name === lastSuggestion.name);
    if (existing) existing.quantity += 1;
    else cart.push({ name: lastSuggestion.name, price: lastSuggestion.price, quantity: 1 });
    saveCart(cart);
    return { text: `${lastSuggestion.productName} was added to your request list as an estimate. Pricing and quantity are confirmed by Triangle Coatings before any order. ${DISCLAIMER}`, options: ["Estimate another project", "Safety help"] };
  }

  const safetyOnly = /safety|ppe|danger|hazard|respirator|flammable|spill|fire|disposal|first aid|sds/.test(n) && !/\d/.test(n);
  if (safetyOnly) {
    return { text: `For product-specific hazards, PPE, first aid, spill, fire, and disposal steps, use the Safety/Data Sheets page and the current SDS for your product. General practice: keep away from ignition sources, ventilate, and wear splash-rated eye protection and chemical-resistant gloves. ${DISCLAIMER}`, options: ["Bathroom tile estimate", "Other project"] };
  }

  const profile = matchProfile(message);
  const coverage = calculateCoverage(message);
  if (!profile && !coverage) {
    return { text: "What are you coating, and roughly what size? Try 'bathroom tile 6x8', 'concrete garage 20x22', or 'wood cabinets 120 sq ft'.", options: ["Bathroom tile estimate", "Concrete floor estimate", "Other project"] };
  }

  const selected = profile || knowledge.find((i) => i.id === "architectural");
  const coverageText = coverage ? `${formatCoverage(coverage)} ` : "Send dimensions or square footage and I can estimate gallons. ";
  const gallons = coverage?.gallons || 1;
  const suggestion = {
    name: `Estimate: ${selected.productName}`,
    price: Math.round(gallons * selected.unitPrice * 100) / 100,
    productName: selected.productName,
  };
  return {
    text: `${selected.project}: ${selected.recommendation} ${coverageText}${selected.safety} ${DISCLAIMER} Add this estimate to your request list?`,
    suggestion,
    options: ["Add to request", "Change size", "Safety help"],
  };
}

export function initAssistant() {
  if (document.querySelector(".ai-chatbot")) return;

  const chatbot = document.createElement("aside");
  chatbot.className = "ai-chatbot";
  chatbot.setAttribute("aria-label", "Coating planning assistant");
  chatbot.innerHTML = `
    <button class="ai-chatbot__toggle" type="button" aria-expanded="false" aria-controls="ai-chatbot-panel">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9.4l-4.7 3.4A1 1 0 0 1 3 19.6V6a2 2 0 0 1 2-2Z"/></svg>
      Coating Help
    </button>
    <section class="ai-chatbot__panel" id="ai-chatbot-panel" aria-live="polite">
      <div class="ai-chatbot__header"><div><strong>Coating Planning Assistant</strong><span>Planning guidance &mdash; not a substitute for the SDS</span></div><button class="ai-chatbot__close" type="button" aria-label="Close assistant">Close</button></div>
      <div class="ai-chatbot__messages"></div>
      <div class="ai-chatbot__options" aria-label="Suggested replies"></div>
      <form class="ai-chatbot__form"><input class="ai-chatbot__input" type="text" placeholder="Describe your project and size..." aria-label="Ask the coating planning assistant" /><button class="ai-chatbot__send" type="submit">Send</button><p class="ai-chatbot__note">Planning only. Confirm product choice, coverage, and safety with Triangle Coatings and the current data sheet and SDS.</p></form>
    </section>`;
  document.body.appendChild(chatbot);

  const toggle = chatbot.querySelector(".ai-chatbot__toggle");
  const close = chatbot.querySelector(".ai-chatbot__close");
  const messages = chatbot.querySelector(".ai-chatbot__messages");
  const options = chatbot.querySelector(".ai-chatbot__options");
  const form = chatbot.querySelector(".ai-chatbot__form");
  const input = chatbot.querySelector(".ai-chatbot__input");
  let lastSuggestion = null;

  function addMessage(text, fromUser = false) {
    const el = document.createElement("div");
    el.className = `ai-chatbot__message${fromUser ? " ai-chatbot__message--user" : ""}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function setOptions(next = []) {
    options.innerHTML = next.map((o) => `<button class="ai-chatbot__option" type="button">${o}</button>`).join("");
  }

  function run(text) {
    const message = normalize(text) === "add to request" ? "add that to my request" : text;
    addMessage(text, true);
    const result = buildResponse(message, lastSuggestion);
    if (result.suggestion) lastSuggestion = result.suggestion;
    addMessage(result.text);
    setOptions(result.options || []);
  }

  function setOpen(open) {
    chatbot.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open) window.setTimeout(() => input.focus({ preventScroll: true }), 80);
  }

  toggle.addEventListener("click", () => setOpen(!chatbot.classList.contains("is-open")));
  close.addEventListener("click", () => setOpen(false));
  options.addEventListener("click", (event) => {
    const option = event.target.closest(".ai-chatbot__option");
    if (option) run(option.textContent);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    run(text);
    input.value = "";
  });

  addMessage("Hi — tell me what you are coating and the size, like 'bathroom tile 6x8' or 'concrete garage 20x22'. I can estimate coverage and flag safety considerations. Always confirm with the product data sheet and SDS.");
  setOptions(["Bathroom tile estimate", "Concrete floor estimate", "Other project"]);
}

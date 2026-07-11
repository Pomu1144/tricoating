// Entry point. Each feature initializer guards its own DOM so a page that is
// missing a component never causes errors on another page. A failure in one
// module is isolated and logged rather than aborting the rest.

import { initCart } from "./cart.js";
import { initNav } from "./ui.js";
import { initStore } from "./store.js";
import { initForms } from "./forms.js";
import { initSafety } from "./safety.js";
import { initAssistant } from "./assistant.js";

function safe(label, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[Triangle Coatings] ${label} failed to initialize:`, err);
  }
}

function boot() {
  safe("navigation", initNav);
  safe("cart", initCart);
  safe("store", initStore);
  safe("forms", initForms);
  safe("safety", initSafety);
  safe("assistant", initAssistant);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

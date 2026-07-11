// Navigation: mobile drawer + accessible dropdowns. All selectors are
// optional-guarded so a page missing any component never breaks others.

export function initNav() {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const navGroups = document.querySelectorAll(".nav-group");
  const mobileQuery = window.matchMedia("(max-width: 820px)");

  function closeDrawer() {
    body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    navGroups.forEach((group) => group.classList.remove("is-open"));
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) navGroups.forEach((group) => group.classList.remove("is-open"));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && body.classList.contains("nav-open")) {
        closeDrawer();
        menuToggle.focus();
      }
    });

    // Outside-click closes the drawer while open on small screens.
    document.addEventListener("click", (event) => {
      if (!body.classList.contains("nav-open")) return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      closeDrawer();
    });
  }

  navGroups.forEach((group) => {
    const button = group.querySelector("button");
    if (!button) return;
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      if (!mobileQuery.matches) return;
      const willOpen = !group.classList.contains("is-open");
      navGroups.forEach((other) => {
        if (other !== group) {
          other.classList.remove("is-open");
          other.querySelector("button")?.setAttribute("aria-expanded", "false");
        }
      });
      group.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.querySelectorAll(".primary-nav a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // Reset any mobile drawer state when returning to desktop layout.
  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) closeDrawer();
  });
}

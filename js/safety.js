// Safety & Data Sheets search. Filters the visible sheet list and keeps an
// accessible result count / no-results state in sync.

export function initSafety() {
  const search = document.querySelector(".safety-search");
  const cards = Array.from(document.querySelectorAll(".sheet-card"));
  const count = document.querySelector("[data-safety-count]");
  const noResults = document.querySelector("[data-no-sheets]");
  const typeFilters = document.querySelectorAll("[data-sheet-filter]");
  if (!cards.length) return;

  let activeType = "all";

  function update() {
    const query = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const text = `${card.dataset.sheetText || ""} ${card.textContent}`.toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesType = activeType === "all" || (card.dataset.sheetType || "") === activeType;
      const show = matchesQuery && matchesType;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = String(visible);
    if (noResults) noResults.hidden = visible !== 0;
  }

  search?.addEventListener("input", update);
  search?.form?.addEventListener("reset", () => window.setTimeout(update, 0));

  typeFilters.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeType = btn.dataset.sheetFilter || "all";
      typeFilters.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      update();
    });
  });

  update();
}

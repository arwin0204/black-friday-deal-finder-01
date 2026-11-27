// DealHound wiring: reads the controls, applies the filters, and renders
// the page. Every control works without a page reload.

import { DEALS, CHECKED_AT } from "./deals.js";
import { CATEGORIES, STORES, blankFilters, applyFilters, sortDeals, topPicks } from "./filters.js";
import { renderDeals, renderTopPicks, renderStats, renderResultLine, fillSelect, renderCategoryChips } from "./render.js";

const filters = blankFilters();

// A filtered view can be shared or linked to: ?q=airpods, ?category=TVs,
// ?store=Amazon, ?minDiscount=50, ?sort=discount, ?newLows=1.
const params = new URLSearchParams(location.search);
if (params.get("q")) filters.query = params.get("q");
if (params.get("category")) filters.category = params.get("category");
if (params.get("store")) filters.store = params.get("store");
if (params.get("minDiscount")) filters.minDiscount = Number(params.get("minDiscount"));
if (params.get("sort")) filters.sort = params.get("sort");
if (params.get("newLows") === "1") filters.newLowsOnly = true;

const grid = document.getElementById("deal-grid");
const resultLine = document.getElementById("result-line");
const searchBox = document.getElementById("search");
const storeSelect = document.getElementById("store-filter");
const discountSelect = document.getElementById("discount-filter");
const sortSelect = document.getElementById("sort");
const newLowsBox = document.getElementById("new-lows-only");
const chipsBox = document.getElementById("category-chips");
const clearButton = document.getElementById("clear-filters");

function refresh() {
  const filtered = sortDeals(applyFilters(DEALS, filters), filters.sort);
  renderDeals(filtered, grid);
  renderResultLine(filtered, DEALS.length, resultLine);
  renderCategoryChips(chipsBox, filters.category);
}

fillSelect(storeSelect, ["All", ...STORES]);
searchBox.value = filters.query;
storeSelect.value = filters.store;
discountSelect.value = String(filters.minDiscount);
sortSelect.value = filters.sort;
newLowsBox.checked = filters.newLowsOnly;
renderTopPicks(topPicks(3), document.getElementById("top-picks"));
renderStats(document.getElementById("stats"));
document.getElementById("checked-note").textContent =
  `All prices checked ${CHECKED_AT}. Prices move fast on Black Friday — confirm the price at the store before you pay.`;

searchBox.addEventListener("input", () => { filters.query = searchBox.value; refresh(); });
storeSelect.addEventListener("change", () => { filters.store = storeSelect.value; refresh(); });
discountSelect.addEventListener("change", () => { filters.minDiscount = Number(discountSelect.value); refresh(); });
sortSelect.addEventListener("change", () => { filters.sort = sortSelect.value; refresh(); });
newLowsBox.addEventListener("change", () => { filters.newLowsOnly = newLowsBox.checked; refresh(); });
chipsBox.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  filters.category = button.dataset.category;
  refresh();
});
clearButton.addEventListener("click", () => {
  Object.assign(filters, blankFilters());
  searchBox.value = "";
  storeSelect.value = "All";
  discountSelect.value = "0";
  sortSelect.value = "best";
  newLowsBox.checked = false;
  refresh();
});

refresh();

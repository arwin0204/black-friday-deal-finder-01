// DealHound filters: pure functions over the deal list. Search matches the
// product name, store and category; the category, store and minimum-discount
// filters narrow it further; sorting orders the result for the shopper.

import { DEALS, VERDICTS, discountPct, savedAmount } from "./deals.js";

export const CATEGORIES = [...new Set(DEALS.map((d) => d.category))].sort();
export const STORES = [...new Set(DEALS.map((d) => d.store))].sort();

export function blankFilters() {
  return { query: "", category: "All", store: "All", minDiscount: 0, newLowsOnly: false, sort: "best" };
}

export function applyFilters(deals, f) {
  const q = f.query.trim().toLowerCase();
  return deals.filter((d) => {
    if (q && !(d.product + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    if (f.category !== "All" && d.category !== f.category) return false;
    if (f.store !== "All" && d.store !== f.store) return false;
    if (discountPct(d) < f.minDiscount) return false;
    if (f.newLowsOnly && d.verdict !== "new-low") return false;
    return true;
  });
}

export function sortDeals(deals, sort) {
  const list = [...deals];
  if (sort === "discount") return list.sort((a, b) => discountPct(b) - discountPct(a));
  if (sort === "saving") return list.sort((a, b) => savedAmount(b) - savedAmount(a));
  if (sort === "price") return list.sort((a, b) => a.sale - b.sale);
  // "best": verdict rank first, then biggest percentage off.
  return list.sort((a, b) => VERDICTS[a.verdict].rank - VERDICTS[b.verdict].rank || discountPct(b) - discountPct(a));
}

export function topPicks(count) {
  return sortDeals(DEALS, "best").slice(0, count);
}

export function totalSavings(deals) {
  return deals.reduce((sum, d) => sum + savedAmount(d), 0);
}

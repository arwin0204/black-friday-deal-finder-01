// DealHound rendering: turns a filtered deal list into cards, and the
// header stats, top-picks strip and result line into the page. No network
// calls here — everything shown comes from app/deals.js.

import { CHECKED_AT, DEALS, VERDICTS, discountPct, savedAmount, formatPrice } from "./deals.js";
import { CATEGORIES, STORES, totalSavings } from "./filters.js";

function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function dealCard(deal) {
  const pct = discountPct(deal);
  const saved = savedAmount(deal);
  const verdict = VERDICTS[deal.verdict];
  return `
  <article class="card" id="deal-${esc(deal.id)}" data-id="${esc(deal.id)}">
    <div class="card-top">
      <span class="store">${esc(deal.store)}</span>
      <span class="verdict verdict-${esc(deal.verdict)}">${verdict.label}</span>
    </div>
    <h3 class="product">${esc(deal.product)}</h3>
    <p class="category">${esc(deal.category)}</p>
    <div class="prices">
      <span class="sale">${formatPrice(deal.sale, deal.isMonthly)}</span>
      <span class="usual"><s>${formatPrice(deal.usual, deal.isMonthly)}</s></span>
      <span class="pct">−${pct}%</span>
    </div>
    <p class="saved">You save ${formatPrice(saved)}</p>
    <p class="why"><strong>Why it counts:</strong> ${esc(deal.verdictNote)}</p>
    <p class="evidence">${esc(deal.evidence)}</p>
    <p class="checked">Price checked ${esc(CHECKED_AT)} · Source: <a href="${esc(deal.sourceUrl)}" target="_blank" rel="noopener">${esc(deal.sourceName)}</a></p>
    <a class="cta" href="${esc(deal.storeUrl)}" target="_blank" rel="noopener">View at ${esc(deal.store)} →</a>
  </article>`;
}

export function renderDeals(list, container) {
  if (!list.length) {
    container.innerHTML = `<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>`;
    return;
  }
  container.innerHTML = list.map(dealCard).join("");
}

export function renderTopPicks(list, container) {
  container.innerHTML = list
    .map((d, i) => `
    <a class="pick" href="#deal-${esc(d.id)}">
      <span class="pick-rank">#${i + 1}</span>
      <span class="pick-name">${esc(d.product)}</span>
      <span class="pick-price">${formatPrice(d.sale, d.isMonthly)} <s>${formatPrice(d.usual, d.isMonthly)}</s> <b>−${discountPct(d)}%</b></span>
      <span class="pick-store">${esc(d.store)}</span>
    </a>`)
    .join("");
}

export function renderStats(container) {
  const avg = Math.round(DEALS.reduce((s, d) => s + discountPct(d), 0) / DEALS.length);
  container.innerHTML = `
    <div class="stat"><strong>${DEALS.length}</strong><span>verified deals</span></div>
    <div class="stat"><strong>${STORES.length}</strong><span>stores</span></div>
    <div class="stat"><strong>${CATEGORIES.length}</strong><span>categories</span></div>
    <div class="stat"><strong>${avg}%</strong><span>average discount</span></div>
    <div class="stat"><strong>$${Math.round(totalSavings(DEALS)).toLocaleString("en-US")}</strong><span>total savings if you bought one of each</span></div>`;
}

export function renderResultLine(list, total, container) {
  container.textContent = list.length === total
    ? `Showing all ${total} deals`
    : `Showing ${list.length} of ${total} deals`;
}

export function fillSelect(select, options) {
  select.innerHTML = options.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join("");
}

export function renderCategoryChips(container, active) {
  const cats = ["All", ...CATEGORIES];
  container.innerHTML = cats
    .map((c) => `<button type="button" class="chip${c === active ? " active" : ""}" data-category="${esc(c)}">${esc(c)}</button>`)
    .join("");
}

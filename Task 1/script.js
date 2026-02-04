const products = [
    { id: 1, name: "Wireless Headphones", price: 59.99, category: "Electronics" },
    { id: 2, name: "Bluetooth Speaker", price: 39.99, category: "Electronics" },
    { id: 3, name: "USB-C Charger", price: 19.99, category: "Electronics" },
    { id: 4, name: "Hardcover Notebook", price: 12.5, category: "Stationery" },
    { id: 5, name: "Ballpoint Pen Set", price: 6.99, category: "Stationery" },
    { id: 6, name: "Mystery Novel", price: 14.99, category: "Books" },
    { id: 7, name: "Cookbook", price: 22.0, category: "Books" },
    { id: 8, name: "Yoga Mat", price: 24.95, category: "Fitness" },
    { id: 9, name: "Dumbbell Pair (5kg)", price: 49.99, category: "Fitness" },
    { id: 10, name: "Desk Lamp", price: 29.0, category: "Home" }
];

// Currency settings: display in INR
const currencySymbol = "₹";

let conversionRate = 82.0;

// DOM references
const productsEl = document.getElementById("products");
const categorySelect = document.getElementById("category");
const searchInput = document.getElementById("search");
const countEl = document.getElementById("count");
const noResultsEl = document.getElementById("no-results");
const categoryButtonsEl = document.getElementById("category-buttons");

let selectedCategory = "All";
let searchTerm = "";

// Initialize page
function init() {
    populateCategories();
    renderProducts(products);
    attachEventListeners();
    updateCount(products.length);
}

// Get category list from products (unique)
function getCategories() {
    const cats = Array.from(new Set(products.map(p => p.category)));
    cats.sort();
    return cats;
}

// Populate dropdown and quick buttons
function populateCategories() {
    const cats = getCategories();
    // dropdown already has "All" option
    cats.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });

    // create quick buttons (including "All")
    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.dataset.category = "All";
    allBtn.classList.add("active");
    categoryButtonsEl.appendChild(allBtn);

    cats.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat;
        btn.dataset.category = cat;
        categoryButtonsEl.appendChild(btn);
    });
}

// Render product cards for given list
function renderProducts(list) {
    productsEl.innerHTML = "";
    if (!list.length) {
        noResultsEl.hidden = false;
        updateCount(0);
        return;
    }
    noResultsEl.hidden = true;

    list.forEach(p => {
        const card = document.createElement("article");
        card.className = "card";
        const priceInr = (p.price * conversionRate).toFixed(2);
        card.innerHTML = `
      <div class="name">${escapeHtml(p.name)}</div>
      <div class="category">${escapeHtml(p.category)}</div>
      <div class="price">${currencySymbol}${priceInr}</div>
    `;
        productsEl.appendChild(card);
    });

    updateCount(list.length);
}

// Basic XSS-safe text insertion
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[s]);
}

// Combine category + search filter
function applyFilters() {
    const filtered = products.filter(p => {
        const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });
    renderProducts(filtered);
}

// Attach UI listeners
function attachEventListeners() {
    categorySelect.addEventListener("change", (e) => {
        selectedCategory = e.target.value;
        // sync buttons
        setActiveCategoryButton(selectedCategory);
        applyFilters();
    });

    searchInput.addEventListener("input", (e) => {
        searchTerm = e.target.value.trim();
        applyFilters();
    });

    categoryButtonsEl.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        selectedCategory = btn.dataset.category || "All";
        // set dropdown
        categorySelect.value = selectedCategory;
        setActiveCategoryButton(selectedCategory);
        applyFilters();
    });
}

// Update result count
function updateCount(n) {
    countEl.textContent = `${n} product${n !== 1 ? "s" : ""} shown`;
}

// Visually set active button
function setActiveCategoryButton(cat) {
    const buttons = categoryButtonsEl.querySelectorAll("button");
    buttons.forEach(b => b.classList.toggle("active", b.dataset.category === cat));
}

// Initialize the UI
init();

// Optional helper: expose a function to update conversion rate at runtime
// Example: window.setConversionRate(74.5);
window.setConversionRate = function(rate) {
    const r = Number(rate);
    if (!isFinite(r) || r <= 0) return;
    conversionRate = r;
    applyFilters();
};
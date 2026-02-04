const products = [
    { id: 'c1', title: 'Intro to AI', category: 'AI', price: 199 },
    { id: 'c2', title: 'Deep Learning', category: 'AI', price: 299 },
    { id: 'c3', title: 'Cloud Fundamentals', category: 'Cloud', price: 149 },
    { id: 'c4', title: 'Kubernetes Basics', category: 'Cloud', price: 179 },
    { id: 'c5', title: 'ML Ops', category: 'AI', price: 249 }
];

const fmt = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const cart = new Map();
const $ = s => document.querySelector(s);
const productList = $('#productList'),
    cartList = $('#cartList');
const category = $('#categoryFilter'),
    search = $('#search');
const totalItems = $('#totalItems'),
    subtotal = $('#subtotal'),
    checkout = $('#checkoutBtn');

['All', ...new Set(products.map(p => p.category))].forEach(c => {
    const o = document.createElement('option');
    o.value = c;
    o.textContent = c;
    category.appendChild(o);
});

const renderProducts = (cat = 'All', q = '') => {
    productList.innerHTML = '';
    products
        .filter(p => (cat === 'All' || p.category === cat) && p.title.toLowerCase().includes(q.toLowerCase()))
        .forEach(p => {
            const li = document.createElement('li');
            li.className = 'product-card';
            li.innerHTML = `<div class="card-top">
                        <div>
                          <div class="card-title">${p.title}</div>
                          <div class="card-meta">${p.category}</div>
                        </div>
                        <div class="price-chip">${fmt(p.price)}</div>
                      </div>
                      <div class="card-actions">
                        <button class="btn-ghost" disabled>Details</button>
                        <button class="btn add" data-id="${p.id}">Add</button>
                      </div>`;
            productList.appendChild(li);
        });
};

const addToCart = id => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const it = cart.get(id);
    cart.set(id, it ? {...it, qty: it.qty + 1 } : {...p, qty: 1 });
    renderCart();
};

const changeQty = (id, d) => {
    const it = cart.get(id);
    if (!it) return;
    it.qty += d;
    if (it.qty <= 0) cart.delete(id);
    else cart.set(id, it);
    renderCart();
};

const renderCart = () => {
    cartList.innerHTML = '';
    if (!cart.size) { cartList.innerHTML = '<li class="empty">Cart is empty</li>'; } else {
        for (const [id, it] of cart) {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `<div>
                        <div><strong>${it.title}</strong></div>
                        <div class="meta">${fmt(it.price)} × ${it.qty} = ${fmt(it.price*it.qty)}</div>
                      </div>
                      <div class="qty-controls">
                        <button class="qty-btn dec" data-id="${id}">−</button>
                        <div>${it.qty}</div>
                        <button class="qty-btn inc" data-id="${id}">+</button>
                        <button class="remove" data-id="${id}">Remove</button>
                      </div>`;
            cartList.appendChild(li);
        }
    }
    const totals = Array.from(cart.values()).reduce((a, c) => (a.items += c.qty, a.subtotal += c.qty * c.price, a), { items: 0, subtotal: 0 });
    totalItems.textContent = totals.items;
    subtotal.textContent = fmt(totals.subtotal);
};

/* Event delegation */
productList.addEventListener('click', e => {
    const b = e.target.closest('.add');
    if (!b) return;
    addToCart(b.dataset.id);
});
cartList.addEventListener('click', e => {
    const inc = e.target.closest('.inc');
    if (inc) { changeQty(inc.dataset.id, 1); return; }
    const dec = e.target.closest('.dec');
    if (dec) { changeQty(dec.dataset.id, -1); return; }
    const rem = e.target.closest('.remove');
    if (rem) {
        cart.delete(rem.dataset.id);
        renderCart();
        return;
    }
});

category.addEventListener('change', () => renderProducts(category.value, search.value));
search.addEventListener('input', () => renderProducts(category.value, search.value));
checkout.addEventListener('click', () => {
    if (!cart.size) return alert('Cart is empty');
    const totals = Array.from(cart.values()).reduce((a, c) => (a.items += c.qty, a.subtotal += c.qty * c.price, a), { items: 0, subtotal: 0 });
    alert(`Checking out ${totals.items} items — ${fmt(totals.subtotal)}`);
    cart.clear();
    renderCart();
});

/* initial */
renderProducts();
renderCart();
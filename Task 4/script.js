let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];


async function loadProducts() {
    const res = await fetch("product.json");
    products = await res.json();

    const available = products.filter(p => p.stock);

    const html = available.map(p => {
        const finalPrice = p.price - (p.price * p.discount / 100);

        return `
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹${finalPrice}</p>
        <p>${p.discount}% OFF</p>
        <button onclick="addToCart(${p.id})">Add</button>
      </div>
    `;
    }).join("");

    document.getElementById("product").innerHTML = html;
}

loadProducts();


function addToCart(id) {
    cart.push(id);
    updateCart();
}


function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}


function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));

    let total = 0;
    let html = "";

    cart.forEach((id, i) => {
        const product = products.find(p => p.id === id);
        const finalPrice = product.price - (product.price * product.discount / 100);

        total += finalPrice;

        html += `
      <div class="card">
        <h4>${product.name}</h4>
        <p>₹${finalPrice}</p>
        <button class="remove" onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
    });

    document.getElementById("cart").innerHTML = html;
    document.getElementById("total").innerText = "Total: ₹" + total;
}

updateCart();
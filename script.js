const menuItems = [
  { id: 1, name: "Ayam Goreng", price: 15000, category: "makanan", img: "images/ayam goreng.jpg" },
  { id: 2, name: "Bebek Goreng + Nasi", price: 25000, category: "makanan", img: "images/bebek goreng + nasi.jpg" },
  { id: 3, name: "Ayam Bakar 1 Ekor", price: 60000, category: "makanan", img: "images/ayam bakar 1 ekor.jpg" },
  { id: 4, name: "Ayam Bakar + Nasi", price: 22000, category: "makanan", img: "images/ayam bakar + nasi.jpg" },
  { id: 5, name: "Ayam Geprek + Nasi", price: 18000, category: "makanan", img: "images/ayam geprek + nasi.jpg" },
  { id: 6, name: "Ayam Bakar Setengah", price: 35000, category: "makanan", img: "images/ayam bakar setengah.jpg" },
  { id: 7, name: "Nasi Polos", price: 5000, category: "makanan", img: "images/nasi polos.jpg" },
  { id: 8, name: "Tahu Tempe", price: 8000, category: "makanan", img: "images/tahu tempe.jpg" },
  { id: 9, name: "Es Teh Manis", price: 5000, category: "minuman", img: "images/ice teh manis.jpg" },
  { id: 10, name: "Es Jeruk", price: 7000, category: "minuman", img: "images/ice jeruk.jpg" },
];

let cart = [];
let currentCategory = "all";

function renderMenu() {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";

  const filtered = currentCategory === "all" ? menuItems : menuItems.filter(item => item.category === currentCategory);

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Rp ${item.price.toLocaleString()}</p>
      <div class="controls">
        <button class="add" onclick="addToCart(${item.id})">+</button>
        <span id="qty-${item.id}">${getQty(item.id)}</span>
        <button class="remove" onclick="removeFromCart(${item.id})">-</button>
      </div>
    `;
    menuList.appendChild(card);
  });
}

function filterMenu(category) {
  currentCategory = category;
  document.querySelectorAll(".filter-buttons button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderMenu();
}

function getQty(id) {
  const found = cart.find(i => i.id === id);
  return found ? found.qty : 0;
}

function addToCart(id) {
  const found = cart.find(i => i.id === id);
  if (found) {
    found.qty++;
  } else {
    const item = menuItems.find(i => i.id === id);
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
  renderMenu();
}

function removeFromCart(id) {
  const found = cart.find(i => i.id === id);
  if (found) {
    found.qty--;
    if (found.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateCart();
  renderMenu();
}

function updateCart() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.qty} = Rp ${ (item.price*item.qty).toLocaleString() }`;
    cartList.appendChild(li);
  });

  cartTotal.textContent = total.toLocaleString();
}

function clearCart() {
  cart = [];
  updateCart();
  renderMenu();
}

function checkout() {
  if (cart.length === 0) {s
    alert("Keranjang kosong!");
    return;
  }

  const name = document.getElementById("buyer-name").value.trim();
  const note = document.getElementById("buyer-note").value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;

  let message = `Halo, saya ingin pesan:\n\n`;
  cart.forEach(item => {
    message += `- ${item.name} x${item.qty} = Rp ${(item.price*item.qty).toLocaleString()}\n`;
  });
  message += `\nTotal: Rp ${document.getElementById("cart-total").textContent}\n`;
  if (name) message += `\nNama: ${name}`;
  if (note) message += `\nCatatan: ${note}`;
  message += `\nPembayaran: ${payment}`;

  const url = `https://wa.me/62895613387405?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

renderMenu();

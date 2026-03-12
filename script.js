// ================== Popup Message ==================
function showPopupMessage(message, type = "success") {
  const popup = document.createElement("div");
  popup.className = `popup-message ${type}`;
  popup.innerText = message;
  document.body.prepend(popup);
  setTimeout(() => popup.remove(), 3000);
}

// ================== Login Form ==================
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.email === email && user.password === password) {
    showPopupMessage("Login successful!");
    setTimeout(() => window.location.href = "index.html", 1000);
  } else {
    showPopupMessage("Invalid credentials!", "error");
  }
});

// ================== Register Form ==================
document.getElementById("registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const name = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  localStorage.setItem("user", JSON.stringify({ name, email, password }));
  showPopupMessage("Registration successful!");
  setTimeout(() => window.location.href = "login.html", 1000);
});

// ================== Smooth Scroll ==================
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ================== Cart ==================
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.innerText = cart.length;
}

function displayCart() {
  const cartContainer = document.getElementById("cartItems");
  const totalPriceEl = document.getElementById("totalPrice");
  if (!cartContainer) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (totalPriceEl) totalPriceEl.innerText = "";
    updateCartCount();
    return;
  }

  let html = "<ul>";
  let total = 0;
  cart.forEach((item, index) => {
    html += `<li>${item.name} - ₹${item.price} <button class="remove-btn" data-index="${index}">Remove</button></li>`;
    total += item.price;
  });
  html += "</ul>";
  cartContainer.innerHTML = html;
  if (totalPriceEl) totalPriceEl.innerText = `Total: ₹${total}`;
  updateCartCount();

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const idx = parseInt(this.dataset.index);
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      showPopupMessage("Item removed from cart!");
    });
  });
}

document.getElementById("placeOrderBtn")?.addEventListener("click", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    showPopupMessage("Your cart is empty!", "error");
    return;
  }
  localStorage.removeItem("cart");
  displayCart();
  showPopupMessage("Order placed successfully!");
});

updateCartCount();
displayCart();

// ================== Add to Cart (Customization) ==================
const modal = document.getElementById("customModal");
const modalProductName = document.getElementById("modalProductName");
const modalProductPrice = document.getElementById("modalProductPrice");
const wrapType = document.getElementById("wrapType");
const note = document.getElementById("note");
const addCustomizedToCart = document.getElementById("addCustomizedToCart");
let currentProduct = { name: "", price: 0 };

document.querySelectorAll(".customize-btn")?.forEach(btn => {
  btn.addEventListener("click", function() {
    currentProduct.name = this.dataset.name;
    currentProduct.price = parseInt(this.dataset.price);
    modalProductName.innerText = currentProduct.name;
    modalProductPrice.innerText = currentProduct.price;
    wrapType.value = "Standard";
    note.value = "";
    modal.style.display = "block";
  });
});

document.querySelector(".close")?.addEventListener("click", () => modal.style.display = "none");

addCustomizedToCart.addEventListener("click", () => {
  let wrapPrice = parseInt(wrapType.selectedOptions[0].dataset.price);
  let notePrice = note.value.trim() !== "" ? 50 : 0;
  const finalPrice = currentProduct.price + wrapPrice + notePrice;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({
    name: currentProduct.name + ` (${wrapType.value}${note.value ? ", Note: " + note.value : ""})`,
    price: finalPrice
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  showPopupMessage(`${currentProduct.name} added to cart!`);
  updateCartCount();
  modal.style.display = "none";
});

window.addEventListener("click", (e) => { if(e.target == modal) modal.style.display = "none"; });
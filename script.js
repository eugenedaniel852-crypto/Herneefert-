const WHATSAPP_NUMBER = "2348063916689";
const products = [
  { name: "Men's Casual Shirt", cat: "Clothes", price: 8000, img: "images/shirt.jpg" },
  { name: "Ladies Summer Dress", cat: "Clothes", price: 12000, img: "images/dress.jpg" },
  { name: "Cozy Hoodie", cat: "Clothes", price: 15000, img: "images/hoodie.jpg" },
  { name: "Leather Handbag", cat: "Bags", price: 20000, img: "images/handbag.jpg" },
  { name: "Travel Backpack", cat: "Bags", price: 14000, img: "images/backpack.jpg" },
  { name: "Canvas Tote Bag", cat: "Bags", price: 6000, img: "images/totebag.jpg" },
  { name: "Classic Sneakers", cat: "Shoes", price: 18000, img: "images/sneakers.jpg" },
  { name: "Ladies Heels", cat: "Shoes", price: 16000, img: "images/heels.jpg" },
  { name: "Phone Case", cat: "Phone Cases", price: 2500, img: "images/phonecase.jpg" },
  { name: "Phone Pouch", cat: "Phone Cases", price: 3000, img: "images/pouch.jpg" },
  { name: "Insulated Water Bottle", cat: "Water Bottles", price: 5000, img: "images/bottle.jpg" },
  { name: "Steel Flask", cat: "Water Bottles", price: 6500, img: "images/flask.jpg" },
  { name: "LED Ring Light", cat: "Ring Lights", price: 9000, img: "images/ringlight.jpg" },
  { name: "Ring Light with Stand", cat: "Ring Lights", price: 13000, img: "images/ringlight2.jpg" },
];
let cart = [];
let currentCat = "All";

function renderProducts() {
  const q = document.getElementById("searchBox").value.toLowerCase();
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  let shown = 0;
  products.forEach((p, i) => {
    if (currentCat !== "All" && p.cat !== currentCat) return;
    if (q && !p.name.toLowerCase().includes(q) && !p.cat.toLowerCase().includes(q)) return;
    shown++;
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = (shown * 0.06) + "s";
const pic = p.img ? '<img src="' + p.img + '" alt="' + p.name + '" style="width:100%;height:150px;object-fit:cover;border-radius:10px;">' : p.icon;    card.innerHTML = ` ${pic} ${p.name} ₦${p.price.toLocaleString()} Min order: ${p.moq} `;
    grid.appendChild(card);
  });
  if (shown === 0) grid.innerHTML = " No products found. ";
}

function setCategory(c, btn) {
  currentCat = c;
  document.querySelectorAll(".cat").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts();
}

function addToCart(i) { cart.push(products[i]); updateCount(); openCart(); }
function updateCount() { document.getElementById("cartCount").textContent = cart.length; }

function openCart() {
  const box = document.getElementById("cartItems");
  if (cart.length === 0) { box.innerHTML = " Your cart is empty. "; }
  else {
    const total = cart.reduce((s, p) => s + p.price, 0);
    box.innerHTML = cart.map((p, i) => ` `).join("") + ` Total: ₦${total.toLocaleString()} `;
  }
  document.getElementById("cartModal").classList.add("show");
}
function closeCart() { document.getElementById("cartModal").classList.remove("show"); }
function removeItem(i) { cart.splice(i, 1); updateCount(); openCart(); }

function sendOrder() {
  if (cart.length === 0) { alert("Your cart is empty."); return; }
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("custPhone").value;
  const addr = document.getElementById("custAddress").value;
  if (!name || !phone || !addr) { alert("Please fill in your name, phone and address."); return; }
  const total = cart.reduce((s, p) => s + p.price, 0);
  const lines = cart.map(p => "- " + p.name + " (₦" + p.price.toLocaleString() + ")").join("\n");
  const msg = "New Herneefert Order\n\n" + lines + "\n\nTotal: ₦" + total.toLocaleString() + "\nName: " + name + "\nPhone: " + phone + "\nAddress: " + addr;
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
}

function toggleChat() {
  const box = document.getElementById("chatbox");
  box.classList.toggle("show");
  if (box.classList.contains("show") && document.getElementById("chatBody").children.length === 0) {
    addMsg("Hi! Welcome to Herneefert. You want it, I get it! Ask me about our products, prices, or delivery.", "bot");
  }
}

function addMsg(text, who) {
  const body = document.getElementById("chatBody");
  const d = document.createElement("div");
  d.className = "msg " + who;
  d.textContent = text;
  body.appendChild(d);
  body.scrollTop = body.scrollHeight;
}

function botReply(q) {
  q = q.toLowerCase();
  for (const p of products) {
    if (q.includes(p.name.toLowerCase()) || q.includes(p.cat.toLowerCase())) {
      const list = products.filter(x => x.cat === p.cat).map(x => x.name + " (₦" + x.price.toLocaleString() + ")").join(", ");
      return "In " + p.cat + " we have: " + list + ". Tap Order Now on any item to buy.";
    }
  }
  if (/price|cost|how much/.test(q)) return "Prices are shown on each product card. Tell me which item and I will give you the price.";
  if (/deliver|shipping|ship/.test(q)) return "Yes, we deliver. You ask, we find, we buy and deliver. Add your address in the order form and we will confirm the delivery cost on WhatsApp.";
  if (/pay|payment/.test(q)) return "We confirm payment details with you on WhatsApp after you send your order.";
  if (/order|buy|how/.test(q)) return "Tap Order Now on any product, fill in your name, phone and address, then send the order on WhatsApp.";
  if (/can't find|cant find|not here|looking for|find me|source/.test(q)) return "Can't see what you want? That is our specialty. Send us the item on WhatsApp and we will find it, buy it and deliver it.";
  if (/hi|hello|hey/.test(q)) return "Hello! What are you shopping for today? We have clothes, bags, phone cases, water bottles, and ring lights.";
  if (/thank/.test(q)) return "You are welcome! Anything else I can help with?";
  return "I can help with products, prices, ordering and delivery. If you need something special, message us on WhatsApp and we will find it for you.";
}

function sendChat() {
  const input = document.getElementById("chatText");
  const t = input.value.trim();
  if (!t) return;
  addMsg(t, "user");
  input.value = "";
  setTimeout(() => addMsg(botReply(t), "bot"), 450);
}

renderProducts();

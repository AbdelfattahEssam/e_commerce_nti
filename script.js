let products = [];
let cart = [];
async function initApp() {
  try {
    
    const res = await fetch("https://fakestoreapi.com/products");
    
  
    allProducts = await res.json();
    populateCategories();
    applyFilterAndSort();
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = `<p style="text-align:center; color:red;">error 404:  error    API</p>`;
  }
}
const cartItemsList = document.getElementById("cartItemsList");
const totalQuantityEl = document.getElementById("totalQuantity");
const totalPriceEl = document.getElementById("totalPrice");
function updateCartDisplay() {
  cartItemsList.innerHTML = "";
  let totalQty = 0;
  let totalPrice = 0;
  cart.forEach((item) => {
    totalQty += item.quantity;
    totalPrice += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.title} - $${item.price.toFixed(2)} ${item.quantity}
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItemsList.appendChild(li);
  });
  totalQuantityEl.textContent = totalQty;
  totalPriceEl.textContent = totalPrice.toFixed(2);
}

function addToCart(productId) {
  const product = allProducts.find((x) => x.id === productId);
  if (!product) return;
  const itemInCart = cart.find((item) => item.id === productId);
  if (itemInCart) {
    itemInCart.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartDisplay();
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index > -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
  }
  updateCartDisplay();
}
const productsContainer = document.getElementById("productsContainer");
let filteredProducts = [];

let currentPage = 1;

const itemsPerPage = 6;

function renderProducts() {
  productsContainer.innerHTML = "";
  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = "<p>not found</p>";
    return;
  }
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = filteredProducts.slice(start, end);
  currentItems.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3 class="product-title" title="${product.title}">${product.title}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <div class="product-actions">
        <a href="details.html?id=${product.id}" class="btn-details">View Details</a>
        <button class="btn-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const minPriceInput = document.getElementById("minPriceInput");
const maxPriceInput = document.getElementById("maxPriceInput");
const sortSelect = document.getElementById("sortSelect");

searchInput.addEventListener("input", applyFilterAndSort);
categorySelect.addEventListener("change", applyFilterAndSort);
minPriceInput.addEventListener("input", applyFilterAndSort);
maxPriceInput.addEventListener("input", applyFilterAndSort);
sortSelect.addEventListener("change", applyFilterAndSort);

function applyFilterAndSort() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedCat = categorySelect.value;
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
  const sortBy = sortSelect.value;
  filteredProducts = allProducts.filter((product) => {
    const matchSearch = product.title.toLowerCase().includes(query);
    const matchCategory =
      selectedCat === "all" || product.category === selectedCat;
    const matchPrice = product.price >= minPrice && product.price <= maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });
  if (sortBy === "name") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "price") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "rating") {
    filteredProducts.sort(
      (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0),
    );
  }
  currentPage = 1;
  renderProducts();
  renderPagination();
}

function populateCategories() {
  const categories = [...new Set(allProducts.map((p) => p.category))];
  categories.forEach((category) => {
    const opt = document.createElement("option");
    opt.value = category;
    opt.textContent = category;
    categorySelect.appendChild(opt);
  });
}

const paginationContainer = document.getElementById("paginationContainer");

function renderPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (totalPages <= 1) return;
  const prevBtn = document.createElement("button");
  prevBtn.className = "pagination-btn";
  prevBtn.textContent = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      renderPagination();
    }
  };
  paginationContainer.appendChild(prevBtn);
  for (let i = 1; i <= totalPages; i++) {
    const numBtn = document.createElement("button");
    numBtn.className = `pagination-btn page-num ${currentPage === i ? "active" : ""}`;
    numBtn.textContent = i;
    numBtn.onclick = () => {
      currentPage = i;
      renderProducts();
      renderPagination();
    };
    paginationContainer.appendChild(numBtn);
  }
  const nextBtn = document.createElement("button");
  nextBtn.className = "pagination-btn";
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      renderPagination();
    }
  };
  paginationContainer.appendChild(nextBtn);
}

initApp();

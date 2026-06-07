let products = [];


let cart =[]
let favorites = []

function getJsonCookie(cookieName) {

    const allCookies = document.cookie.split("; ");

    const targetCookie = allCookies.find(row =>
        row.startsWith(cookieName + "=")
    );

    if (targetCookie) {

        const encodedData =
            targetCookie.split("=")[1];

        return JSON.parse(
            decodeURIComponent(encodedData)
        );
    }

    return null;
}

function saveJsonCookie(cookieName, data, seconds) {

    const jsonString = JSON.stringify(data);

    const safeString =
        encodeURIComponent(jsonString);

    document.cookie =
        `${cookieName}=${safeString}; max-age=${seconds}; path=/`;
}




async function fetchProducts() {
    try {
        const response = await fetch('store_db.json');
        const data = await response.json();

        products = data;

        displayProducts(products);

    } catch (error) {
        console.error("Помилка завантаження книг:", error);
    }
}

function displayProducts(productsArray) {

    const productsGrid = document.getElementById("productsGrid");

    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    productsArray.forEach(product => {

        productsGrid.innerHTML += `
            <div class="product-card">

                <img src="${product.image}" alt="${product.title}">

                <div class="product-card-content">

                    <h3>${product.title}</h3>

                    <p>${product.category}</p>

                    <p class="price">${product.price} грн</p>

                    <div class="buttons">

                        <button 
                        class="favorite-btn"
                        onclick="addToFavorites(${product.id})">

                        ❤️ Обране

                        </button>

                        <button
                        class="cart-btn"
                        onclick="addToCart(${product.id})">

                        🛒 Кошик

                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}

fetchProducts();

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();

        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(value)
        );

        displayProducts(filteredProducts);

    });

}



function filterByCategory(category) {

    if (category === "Усі") {
        displayProducts(products);
        return;
    }

    const filteredProducts = products.filter(product =>
        product.category === category
    );

    displayProducts(filteredProducts);
}

function loadCart() {

    const savedCart =
        getJsonCookie("cart");

    if (savedCart !== null) {
        cart = savedCart;
    }
}

function loadFavorites() {

    const savedFavorites =
        getJsonCookie("favorites");

    if (savedFavorites !== null) {
        favorites = savedFavorites;
    }
}

loadCart();
loadFavorites();







function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) return;

    const cartItem =
        cart.find(
            item => item.id === productId
        );

    if (cartItem) {

        cartItem.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveJsonCookie(
        "cart",
        cart,
        3600 * 24 * 7
    );

    showToast("Книгу додано до кошика!");
    updateCartCount();
}
function addToFavorites(productId) {

    console.log("CLICK FAVORITES", productId);

    const product = products.find(item => item.id === productId);

    console.log("FOUND PRODUCT:", product);

    if (!product) {
        console.log("NO PRODUCT FOUND");
        return;
    }

    const exists = favorites.find(item => item.id === productId);

    if (!exists) {

        favorites.push(product);

        saveJsonCookie("favorites", favorites, 3600 * 24 * 7);

        console.log("ABOUT TO SHOW TOAST");

        showToast("Книгу додано до обраного!");
    }
}
function displayCart() {

    const cartContainer =
        document.getElementById("cartContainer");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";


if (cart.length === 0) {

    cartContainer.innerHTML = `

     <div class="empty-cart">
         <h2>🛒 Ваш кошик порожній 🛒</h2> 
<p>📚 Саме час знайти нову книгу 📚</p>
</div>
    `;
const totalPrice = document.getElementById("totalPrice");
if (totalPrice) {
totalPrice.textContent = "Загальна сума: 0 грн";
}
    return;
}   






    let total = 0;

    cart.forEach(product => {

        total +=
            product.price * product.quantity;

        cartContainer.innerHTML += `

            <div class="cart-item">

                <h3>${product.title}</h3>

                <p>
                    Ціна:
                    ${product.price} грн
                </p>

                <p> Кількість: </p>
                <button onclick="decreaseQuantity(${product.id})">◁</button>
                <span>${product.quantity}</span>
                <button onclick="increaseQuantity(${product.id})">▷</button>
                

                <p>
                    Разом:
                    ${product.price * product.quantity} грн
                </p>
      
                <button
                class="remove-btn"
                onclick="removeFromCart(${product.id})">
                    Видалити
                </button>
            </div>

        `;
    });

    const totalPrice =
        document.getElementById("totalPrice");

    if (totalPrice) {

        totalPrice.textContent =
            `Загальна сума: ${total} грн`;
    }
}

displayCart();
function displayFavorites() {

    const favoritesContainer =
        document.getElementById("favoritesContainer");

    if (!favoritesContainer) return;

    favoritesContainer.innerHTML = "";

    favorites.forEach(product => {

        favoritesContainer.innerHTML += `

            <div class="favorite-item">

                <h3>${product.title}</h3>
                <p>${product.category}</p>
                <p>${product.price} грн</p>

                <button class="remove-fav-btn" onclick="removeFromFavorites(${product.id})">
                    Видалити з обраного
                </button>
            </div>

        `;
    });
}

function removeFromFavorites(productId) {

    favorites = favorites.filter(item => item.id !== productId);
    saveJsonCookie("favorites", favorites, 3600 * 24 * 7);

    displayFavorites();
    showToast("Книгу видалено з обраного!");
}

displayFavorites();
function showToast(message) {

    const container =
        document.getElementById("toastContainer");

    if (!container) {
        console.log("NO TOAST CONTAINER");
        return;
    }

    const toast =
        document.createElement("div");

    toast.classList.add("toast");

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);
    saveJsonCookie("cart", cart, 3600 * 24 * 7);
    displayCart();
    showToast("Книгу видалено з кошика!");
}   

function placeOrder() {
const name = document.getElementById("customerName").value;
const phone = document.getElementById("customerPhone").value;
const email = document.getElementById("customerEmail").value;
const address = document.getElementById("customerAddress").value;

if ( !/^[А-Яа-яІіЇїЄє A-Za-z\s]+$/.test(name)) {
    showToast("Будь ласка, введіть коректне ім'я!");
    return;
}

if ( !/^[0-9+\s()-]+$/.test(phone) || !/^\+380\d{9}$/.test(phone)) {
    showToast("Будь ласка, введіть коректний номер телефону у форматі +380XXXXXXXXX!");
    return;
}






 if (!name || !phone || !email || !address) {
        showToast("Будь ласка, заповніть всі поля!");
        return;
    }
    cart = [];
    saveJsonCookie("cart", cart, 3600);
    displayCart();

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerEmail").value = "";
    document.getElementById("customerAddress").value = "";
 showToast("📚 Замовлення вже їде до тебе... 🤫✨");
}


function increaseQuantity(productId) {

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;

        saveJsonCookie("cart", cart, 3600 * 24 * 7);
        displayCart();  
    }
    updateCartCount();

}

function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
    }

    saveJsonCookie("cart", cart, 3600 * 24 * 7);
    displayCart();
    updateCartCount();

}

function filterByPrice() {
    const minPrice = Number (document.getElementById("minPrice").value)||0;
    const maxPrice = Number (document.getElementById("maxPrice").value)||Infinity;
    const filteredProducts = products.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
    );
    displayProducts(filteredProducts);
}

document.addEventListener("DOMContentLoaded", () => {

    // 🔗 ПЛАВНЫЙ ПЕРЕХОД
    const links = document.querySelectorAll("a");

    links.forEach(link => {

        link.addEventListener("click", function (e) {

            const href = this.getAttribute("href");

            if (!href || href.startsWith("#")) return;

            e.preventDefault();

            document.body.classList.add("page-out");

            setTimeout(() => {
                window.location.href = href;
            }, 400) ;
        });
    });


    // 🔥 ACTIVE MENU
    const currentPage = window.location.pathname.split("/").pop();

    console.log("PAGE:", currentPage);

    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});
function updateCartCount() {

    const countEl = document.getElementById("cartCount");

    if (!countEl) return;

    const totalCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    countEl.textContent = totalCount;
}
LoadCart();
updateCartCount();
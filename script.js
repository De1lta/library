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

                <p>
                    Кількість:
                    ${product.quantity}
                </p>

                <p>
                    Разом:
                    ${product.price * product.quantity} грн
                </p>

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

                <p>
                    ${product.category}
                </p>

                <p>
                    ${product.price} грн
                </p>

            </div>

        `;
    });
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
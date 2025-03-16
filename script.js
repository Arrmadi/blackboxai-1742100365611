document.addEventListener('DOMContentLoaded', () => {
    // Sample product data with real product images
    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            price: 7999,
            category: "electronics",
            image: "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg",
            description: "High-quality wireless headphones with noise cancellation"
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 15999,
            category: "electronics",
            image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
            description: "Feature-rich smartwatch with health tracking"
        },
        {
            id: 3,
            name: "Cotton T-Shirt",
            price: 1999,
            category: "fashion",
            image: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
            description: "Comfortable cotton t-shirt in various colors"
        },
        {
            id: 4,
            name: "Running Shoes",
            price: 5999,
            category: "fashion",
            image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
            description: "Lightweight and comfortable running shoes"
        },
        {
            id: 5,
            name: "Coffee Maker",
            price: 11999,
            category: "home",
            image: "https://images.pexels.com/photos/2878710/pexels-photo-2878710.jpeg",
            description: "Programmable coffee maker with thermal carafe"
        },
        {
            id: 6,
            name: "Table Lamp",
            price: 2999,
            category: "home",
            image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
            description: "Modern LED table lamp with adjustable brightness"
        }
    ];

    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    // Shopping cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize the website
    function init() {
        renderProducts(products);
        updateCartCount();
        setupEventListeners();
    }

    // Render products to the grid
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = productsToRender.map(product => `
            <div class="product-card" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">₹${product.price}</p>
                    <p>${product.description}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }

    // Set up event listeners
    function setupEventListeners() {
        productsGrid.addEventListener('click', e => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            }
        });

        cartBtn.addEventListener('click', toggleCart);
        closeCartBtn.addEventListener('click', toggleCart);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterProducts(btn.dataset.category);
            });
        });

        searchInput.addEventListener('input', searchProducts);
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Cart functions
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        updateCartTotal();
    }

    function renderCartItems() {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });

        cartItems.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', handleRemoveItem);
        });
    }

    function handleQuantityChange(e) {
        const productId = parseInt(e.target.dataset.id);
        const item = cart.find(item => item.id === productId);
        
        if (e.target.classList.contains('plus')) {
            item.quantity += 1;
        } else if (e.target.classList.contains('minus')) {
            item.quantity = Math.max(0, item.quantity - 1);
            if (item.quantity === 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        updateCart();
    }

    function handleRemoveItem(e) {
        const productId = parseInt(e.target.dataset.id);
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.textContent = `₹${total}`;
    }

    // UI functions
    function toggleCart() {
        cartModal.classList.toggle('active');
        renderCartItems();
    }

    function filterProducts(category) {
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }

    function searchProducts(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }

    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
    }

    // Initialize the website
    init();
});

// Mock Data with Realistic Real World Images from Unsplash
const electronicsProducts = [
    {
        id: 1,
        title: "Apple iPhone 15 Pro Max - 256GB",
        price: 159900,
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
    },
    {
        id: 2,
        title: "Premium Wireless Over-Ear Headphones",
        price: 24500,
        brand: "Sony",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
        id: 3,
        title: "Apple Watch Series 9 GPS",
        price: 41900,
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
        id: 4,
        title: "Vintage Camera Lens 50mm",
        price: 18999,
        brand: "Canon",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
    },
    {
        id: 5,
        title: "MacBook Pro 16-inch M3 Max",
        price: 319900,
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
    },
    {
        id: 6,
        title: "iPad Air 5th Generation",
        price: 59900,
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
    }
];

const trendingProducts = [
    {
        id: 7,
        title: "Nike Air Max Casual Running Shoes",
        price: 8999,
        brand: "Nike",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
        id: 8,
        title: "Classic Aviator Sunglasses",
        price: 3499,
        brand: "Ray-Ban",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083"
    },
    {
        id: 9,
        title: "Urban Explorer Laptop Backpack",
        price: 4599,
        brand: "Wildcraft",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
    },
    {
        id: 10,
        title: "Luxury Perfume EDP 100ml",
        price: 12500,
        brand: "Dior",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601"
    },
    {
        id: 11,
        title: "Aesthetic Indoor Plant",
        price: 999,
        brand: "Greenery",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411"
    },
    {
        id: 12,
        title: "RGB Mechanical Gaming Keyboard",
        price: 6599,
        brand: "Razer",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212"
    }
];

// Combine all for easy indexing
const allProducts = [...electronicsProducts, ...trendingProducts];

// Cart State
let cart = [];

// DOM Elements
const electronicsContainer = document.getElementById('electronics-deals');
const trendingContainer = document.getElementById('trending-deals');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartBadge = document.getElementById('cart-badge');
const cartCountTitle = document.getElementById('cart-count-title');
const cartTotalPrice = document.getElementById('cart-total-price');
const toastMessage = document.getElementById('toast');

// Format price as INR
const formatPrice = (price) => {
    return '₹' + price.toLocaleString('en-IN');
};

// Render Products function
const renderProducts = (products, container) => {
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper" onclick="openProductDetails(${product.id})" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-title" onclick="openProductDetails(${product.id})" style="cursor: pointer;">${product.title}</div>
            <div class="product-price">${formatPrice(product.price)}</div>
            <div class="product-brand">${product.brand}</div>
            <div style="display: flex; width: 100%; gap: 8px;">
                <button class="view-details-btn" onclick="openProductDetails(${product.id})" style="flex: 1; background: #fff; border: 1px solid #d7d7d7; color: #212121; border-radius: 2px; cursor: pointer; padding: 8px; font-weight: 500; font-size: 14px; transition: background 0.2s;">
                    Details
                </button>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" style="flex: 1; margin: 0; padding: 8px; width: auto; font-size: 14px;">
                    <i class="fa-solid fa-cart-plus"></i> Add
                </button>
            </div>
        `;
        container.appendChild(card);
    });
};

// Add to Cart
window.addToCart = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Trigger HappyTrack Event
    if (typeof window.trackAddToCart === 'function') {
        window.trackAddToCart(product.title);
    }

    updateCartUI();
    showToast();
};

window.happyTrackGetCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
};

// Remove from Cart
window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
};

// Update Quantity
window.updateQuantity = (productId, change) => {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        updateCartUI();
    }
}

// Update Cart UI
const updateCartUI = () => {
    // Update badge and title
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartCountTitle.textContent = totalItems;

    // Calculate total
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = formatPrice(totalPrice);

    // Render items or empty message
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.appendChild(emptyCartMessage);
        emptyCartMessage.style.display = 'flex';
    } else {
        emptyCartMessage.style.display = 'none';
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item-div';
            itemDiv.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price-brand">
                        <span class="cart-item-price">${formatPrice(item.price)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">REMOVE</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }
};

// Toast functionality
const showToast = () => {
    toastMessage.classList.add('show');
    setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 2000);
}

// Cart Drawer Toggles
cartToggleBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.style.display = 'block';
});

const closeCart = () => {
    cartSidebar.classList.remove('active');
    setTimeout(() => {
        cartOverlay.style.display = 'none';
    }, 300);
};

closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Initial Render
renderProducts(electronicsProducts, electronicsContainer);
renderProducts(trendingProducts, trendingContainer);
updateCartUI();

// Product Details Modal
window.openProductDetails = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const modalOverlay = document.getElementById('product-details-overlay');
    const modalContent = document.getElementById('product-details-content');
    const modalContainer = document.getElementById('product-details-modal');

    if (!modalOverlay || !modalContent || !modalContainer) return;

    modalContent.innerHTML = `
        <div class="product-detail-flex" style="display: flex; gap: 20px;">
            <div class="product-detail-img" style="flex: 1; display: flex; justify-content: center; align-items: center;">
                <img src="${product.image}" alt="${product.title}" style="max-width: 100%; max-height: 250px; object-fit: contain;">
            </div>
            <div class="product-detail-info" style="flex: 1;">
                <h2 style="font-size: 20px; color: #212121; margin-bottom: 10px;">${product.title}</h2>
                <div class="product-price" style="font-size: 24px; font-weight: 500; color: #388e3c; margin: 10px 0;">${formatPrice(product.price)}</div>
                <div class="product-brand" style="font-size: 14px; color: #878787;">Brand: <strong style="color: #212121;">${product.brand}</strong></div>
                <div class="product-desc" style="margin-top: 15px; color: #555; line-height: 1.5; font-size: 14px;">
                    Experience the robust quality and exceptional design of the <strong>${product.title}</strong>. 
                    Crafted by <strong>${product.brand}</strong>, this product ensures durability, style, and reliability for everyday use.
                    Upgrade your lifestyle with this premium selection today.
                </div>
                <button class="add-to-cart-btn" style="margin-top: 20px; width: 100%; padding: 12px; font-size: 16px;" onclick="addToCart(${product.id}); closeProductDetails();">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;

    modalOverlay.style.display = 'block';
    modalContainer.style.display = 'block';
};

window.closeProductDetails = () => {
    const modalOverlay = document.getElementById('product-details-overlay');
    const modalContainer = document.getElementById('product-details-modal');
    if (modalOverlay) modalOverlay.style.display = 'none';
    if (modalContainer) modalContainer.style.display = 'none';
};

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid") || "guest";
    const analyticsBtn = document.getElementById("analytics-nav-btn");
    if (analyticsBtn && (uid.toLowerCase() === "happilie" || uid.toLowerCase() === "happiee")) {
        analyticsBtn.style.display = "inline-block";
    }
});

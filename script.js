/* ============================================
   CHITRALI DRY FRUITS - MAIN JAVASCRIPT
   ============================================ */

// ========== WAIT FOR DOM TO LOAD ==========
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. MOBILE MENU TOGGLE
    // ============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
            // Change icon
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when a link is clicked (mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
    }

    // ============================================
    // 2. SHOPPING CART FUNCTIONALITY
    // ============================================
    let cart = [];
    const cartCountElement = document.querySelector('.cart-count');

    // Function to update cart count badge
    function updateCartCount() {
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Function to add item to cart
    function addToCart(productName, price) {
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: price,
                quantity: 1
            });
        }

        updateCartCount();
        showNotification(`${productName} added to cart! 🛒`);
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Add to cart button listeners
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            addToCart(productName, price);
            
            // Button animation feedback
            this.textContent = 'Added! ✅';
            this.style.background = '#2d7d46';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
            }, 1500);
        });
    });

    // Load cart from localStorage on page load
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                updateCartCount();
            } catch (e) {
                console.log('Error loading cart:', e);
            }
        }
    }
    loadCart();

    // ============================================
    // 3. SEARCH FUNCTIONALITY
    // ============================================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    function performSearch() {
        if (!searchInput) return;
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            showNotification('Please type something to search 🔍');
            return;
        }

        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        let foundCount = 0;

        productCards.forEach(card => {
            const productName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const productPrice = card.querySelector('.price')?.textContent?.toLowerCase() || '';
            
            if (productName.includes(query) || productPrice.includes(query)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
                foundCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (foundCount === 0) {
            showNotification(`No products found for "${query}" 😕`);
        } else {
            showNotification(`Found ${foundCount} product(s) for "${query}" ✅`);
        }
    }

    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        // Clear search and reset products
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                const productCards = document.querySelectorAll('.product-card');
                productCards.forEach(card => {
                    card.style.display = 'block';
                });
            }
        });
    }

    // ============================================
    // 4. NEWSLETTER SUBSCRIPTION
    // ============================================
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterEmail.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address 📧');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address ❌');
                return;
            }

            // Success - store in localStorage
            localStorage.setItem('subscribedEmail', email);
            showNotification('Thank you for subscribing! 🎉');
            newsletterEmail.value = '';
        });
    }

    // ============================================
    // 5. NOTIFICATION SYSTEM (Toast)
    // ============================================
    function showNotification(message) {
        // Remove existing notification if any
        const existing = document.querySelector('.notification-toast');
        if (existing) {
            existing.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;
        
        // Style the notification
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #2d2a24;
            color: #fff;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: 'Segoe UI', sans-serif;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 16px;
            max-width: 380px;
            animation: slideUp 0.4s ease;
            border-left: 4px solid #8b2f1a;
        `;

        // Close button style
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #aaa;
            font-size: 1.4rem;
            cursor: pointer;
            padding: 0 4px;
            transition: 0.3s;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#fff';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = '#aaa';
        });

        // Close on click
        closeBtn.addEventListener('click', function() {
            toast.remove();
        });

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                toast.style.transition = '0.3s';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);

        document.body.appendChild(toast);
    }

    // ============================================
    // 6. HELPER FUNCTIONS
    // ============================================
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // ============================================
    // 7. SMOOTH SCROLL FOR NAV LINKS (if anchor links)
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // 8. ADD CSS ANIMATIONS DYNAMICALLY
    // ============================================
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* Product card hover glow */
        .product-card:hover {
            box-shadow: 0 12px 40px rgba(139, 47, 26, 0.12) !important;
        }

        /* Add to cart pulse effect */
        .add-to-cart:active {
            transform: scale(0.95);
        }

        /* Cart count bounce */
        .cart-count {
            transition: 0.2s;
        }
    `;
    document.head.appendChild(styleSheet);

    // ============================================
    // 9. CONSOLE WELCOME MESSAGE
    // ============================================
    console.log('%c🍇 Chitrali Dry Fruits', 'font-size: 24px; font-weight: bold; color: #8b2f1a;');
    console.log('%cPure Taste from the Mountains 🏔️', 'font-size: 14px; color: #5a554a;');
    console.log('%c📦 Cart items: ' + cart.reduce((sum, i) => sum + i.quantity, 0), 'font-size: 13px;');

    // ============================================
    // 10. PRODUCT IMAGE PLACEHOLDER FALLBACK
    // ============================================
    document.querySelectorAll('.product-card img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="160" viewBox="0 0 200 160"%3E%3Crect fill="%23f5f0ea" width="200" height="160"/%3E%3Ctext x="100" y="85" font-family="Arial" font-size="14" fill="%238b7a6b" text-anchor="middle"%3E🍇%3C/text%3E%3C/svg%3E';
            this.alt = 'Product image placeholder';
        });
    });

    // ============================================
    // 11. VIEW ALL BUTTON - TRACKING
    // ============================================
    const viewAllBtn = document.querySelector('.view-all .btn-secondary');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            console.log('🔗 View All Products clicked');
            // You can add analytics tracking here
        });
    }

    console.log('✅ Chitrali Dry Fruits website loaded successfully!');
});
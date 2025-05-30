document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => item.id === id);
            
            if (existingItemIndex !== -1) {
                // Item exists, increase quantity
                cart[existingItemIndex].quantity += 1;
                cart[existingItemIndex].total = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
            } else {
                // Add new item to cart
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1,
                    total: price
                });
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show notification
            showNotification('Item added to cart');
        });
    });

    // Show notification function
    function showNotification(message) {
        const notification = document.getElementById('cart-notification');
        notification.querySelector('p').textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Update cart count function
    function updateCartCount() {
        const cartCount = document.querySelectorAll('.cart-count');
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCount.forEach(element => {
            element.textContent = count;
        });
    }

    // Cart page functionality
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
        
        // Handle quantity changes and item removal
        const cartItemList = document.querySelector('.cart-item-list');
        
        if (cartItemList) {
            cartItemList.addEventListener('click', function(e) {
                // Handle quantity decrease
                if (e.target.closest('.minus')) {
                    const cartItem = e.target.closest('.cart-item');
                    const id = cartItem.getAttribute('data-id');
                    updateQuantity(id, -1);
                }
                
                // Handle quantity increase
                if (e.target.closest('.plus')) {
                    const cartItem = e.target.closest('.cart-item');
                    const id = cartItem.getAttribute('data-id');
                    updateQuantity(id, 1);
                }
                
                // Handle item removal
                if (e.target.closest('.remove-item')) {
                    const cartItem = e.target.closest('.cart-item');
                    const id = cartItem.getAttribute('data-id');
                    removeItem(id);
                }
            });
        }
        
        // Apply promo code
        const applyPromoBtn = document.getElementById('apply-promo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', function() {
                const promoCode = document.getElementById('promo-code').value.trim();
                
                if (promoCode === 'HOSTEL10') {
                    // Show applied promo
                    document.querySelector('.promo-input').style.display = 'none';
                    document.querySelector('.promo-applied').style.display = 'block';
                    
                    // Calculate discount
                    updateTotals(true);
                    
                    // Save promo to localStorage
                    localStorage.setItem('promoApplied', 'HOSTEL10');
                } else {
                    alert('Invalid promo code');
                }
            });
        }
        
        // Remove promo code
        const promoRemove = document.querySelector('.promo-remove');
        if (promoRemove) {
            promoRemove.addEventListener('click', function() {
                document.querySelector('.promo-applied').style.display = 'none';
                document.querySelector('.promo-input').style.display = 'flex';
                document.getElementById('promo-code').value = '';
                
                // Remove discount
                localStorage.removeItem('promoApplied');
                updateTotals(false);
            });
        }
        
        // Proceed to checkout
        const checkoutBtn = document.getElementById('proceed-to-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    alert('Your cart is empty. Add some items before checkout.');
                    return;
                }
                
                document.getElementById('cart-section').style.display = 'none';
                document.getElementById('checkout-section').style.display = 'block';
                renderOrderSummary();
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Back to cart button
        const backToCartBtn = document.getElementById('back-to-cart');
        if (backToCartBtn) {
            backToCartBtn.addEventListener('click', function() {
                document.getElementById('checkout-section').style.display = 'none';
                document.getElementById('cart-section').style.display = 'block';
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Payment method selection
        const paymentMethods = document.querySelectorAll('input[name="payment"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                // Hide all payment fields
                document.querySelectorAll('.payment-fields').forEach(field => {
                    field.style.display = 'none';
                });
                
                // Show selected payment fields
                if (this.value === 'upi') {
                    document.getElementById('upi-payment-fields').style.display = 'block';
                } else if (this.value === 'card') {
                    document.getElementById('card-payment-fields').style.display = 'block';
                }
            });
        });
        
        // Place order
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const fullname = formData.get('fullname');
                const phone = formData.get('phone');
                const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                
                // Calculate totals
                const subtotal = cart.reduce((total, item) => total + item.total, 0);
                const tax = subtotal * 0.05;
                let discount = 0;
                
                // Check if promo is applied
                const promoApplied = localStorage.getItem('promoApplied');
                if (promoApplied) {
                    discount = subtotal * 0.1;
                }
                
                const total = subtotal + tax - discount;
                
                // Prepare order details
                const orderDetails = {
                    fullname,
                    phone,
                    paymentMethod,
                    items: cart.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        total: item.total
                    })),
                    subtotal,
                    tax,
                    discount,
                    total
                };
                
                // Submit order to system - check if order-system.js is loaded
                if (typeof placeOrder === 'function') {
                    try {
                        // Use order system to place order
                        const orderId = placeOrder(orderDetails);
                        
                        // Update order number in confirmation
                        document.getElementById('order-number').textContent = orderId;
                        
                        // Clear cart after successful order
                        cart = [];
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartCount();
                        
                        // Show confirmation
                        document.getElementById('checkout-section').style.display = 'none';
                        document.getElementById('order-confirmation').style.display = 'block';
                        
                        // Force a storage event for other windows
                        localStorage.setItem('lastOrderTime', new Date().getTime().toString());
                        
                        console.log('Order placed successfully:', orderId);
                    } catch (error) {
                        console.error('Error placing order:', error);
                        alert('There was an error placing your order. Please try again.');
                    }
                } else {
                    console.error('Order system not loaded');
                    alert('There was an error with the order system. Please try again.');
                }
            });
        }
    }

    // Menu page functionality
    if (window.location.pathname.includes('menu.html')) {
        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        const allDishCards = document.querySelectorAll('.dish-card');
        
        // Check for category parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam) {
            // Scroll to category section
            const categorySection = document.getElementById(categoryParam);
            if (categorySection) {
                setTimeout(() => {
                    categorySection.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
            
            // Activate filter button
            filterButtons.forEach(button => {
                if (button.getAttribute('data-filter') === categoryParam) {
                    button.click();
                }
            });
        }
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                allDishCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Render cart items
    function renderCart() {
        const cartItemList = document.querySelector('.cart-item-list');
        const cartEmpty = document.querySelector('.cart-empty');
        
        if (!cartItemList || !cartEmpty) return;
        
        if (cart.length === 0) {
            cartItemList.innerHTML = '';
            cartEmpty.style.display = 'block';
            return;
        }
        
        cartEmpty.style.display = 'none';
        cartItemList.innerHTML = '';
        
        cart.forEach(item => {
            const template = document.getElementById('cart-template').innerHTML;
            const cartItemHTML = template
                .replace(/{id}/g, item.id)
                .replace(/{name}/g, item.name)
                .replace(/{price}/g, item.price)
                .replace(/{quantity}/g, item.quantity)
                .replace(/{total}/g, item.total)
                .replace(/{image}/g, item.image);
            
            cartItemList.innerHTML += cartItemHTML;
        });
        
        // Check if promo code is applied
        const promoApplied = localStorage.getItem('promoApplied');
        if (promoApplied) {
            document.querySelector('.promo-input').style.display = 'none';
            document.querySelector('.promo-applied').style.display = 'block';
            document.querySelector('.promo-name').textContent = promoApplied;
            updateTotals(true);
        } else {
            updateTotals(false);
        }
    }

    // Update quantity function
    function updateQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity is 0
        if (cart[itemIndex].quantity <= 0) {
            removeItem(id);
            return;
        }
        
        // Update total
        cart[itemIndex].total = cart[itemIndex].quantity * cart[itemIndex].price;
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Re-render cart
        renderCart();
        updateCartCount();
    }

    // Remove item function
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Re-render cart
        renderCart();
        updateCartCount();
    }

    // Update totals function
    function updateTotals(applyDiscount) {
        const subtotal = cart.reduce((total, item) => total + item.total, 0);
        const tax = subtotal * 0.05;
        let discount = 0;
        
        if (applyDiscount) {
            // Apply 10% discount
            discount = subtotal * 0.1;
        }
        
        const total = subtotal + tax - discount;
        
        // Update cart summary
        document.querySelector('.subtotal').textContent = `₹${subtotal.toFixed(0)}`;
        document.querySelector('.tax').textContent = `₹${tax.toFixed(0)}`;
        document.querySelector('.total-amount').textContent = `₹${total.toFixed(0)}`;
        
        if (applyDiscount) {
            document.querySelector('.discount-amount').textContent = `-₹${discount.toFixed(0)}`;
            document.querySelector('.summary-item.discount').style.display = 'flex';
        } else {
            document.querySelector('.summary-item.discount').style.display = 'none';
        }
    }

    // Render order summary
    function renderOrderSummary() {
        const orderItems = document.querySelector('.order-items');
        if (!orderItems) return;
        
        orderItems.innerHTML = '';
        
        cart.forEach(item => {
            const template = document.getElementById('order-item-template').innerHTML;
            const orderItemHTML = template
                .replace(/{name}/g, item.name)
                .replace(/{quantity}/g, item.quantity)
                .replace(/{total}/g, item.total);
            
            orderItems.innerHTML += orderItemHTML;
        });
        
        // Update totals
        const subtotal = cart.reduce((total, item) => total + item.total, 0);
        const tax = subtotal * 0.05;
        let discount = 0;
        
        // Check if promo is applied
        const promoApplied = localStorage.getItem('promoApplied');
        if (promoApplied) {
            discount = subtotal * 0.1;
            document.querySelector('.order-summary .discount').style.display = 'flex';
            document.querySelector('.order-summary .discount-amount').textContent = `-₹${discount.toFixed(0)}`;
        } else {
            document.querySelector('.order-summary .discount').style.display = 'none';
        }
        
        const total = subtotal + tax - discount;
        
        // Update order summary
        document.querySelector('.order-summary .subtotal').textContent = `₹${subtotal.toFixed(0)}`;
        document.querySelector('.order-summary .tax').textContent = `₹${tax.toFixed(0)}`;
        document.querySelector('.order-summary .total-amount').textContent = `₹${total.toFixed(0)}`;
    }
}); 
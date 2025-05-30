// This file handles the communication between the customer site and kitchen dashboard
// In a real application, this would interact with a backend server

// Store for all orders
let allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];

// Initialize sample orders if none exist
function initializeSampleOrders() {
    if (allOrders.length === 0) {
        const sampleOrders = [
            {
                id: 'ORD100001',
                customer: 'John Doe',
                phone: '9876543210',
                time: '12:30',
                date: new Date().toLocaleDateString(),
                status: 'new',
                items: [
                    { name: 'Chicken Biryani', quantity: 1, price: 180, total: 180 }
                ],
                total: 180,
                paymentMethod: 'cash'
            },
            {
                id: 'ORD100002',
                customer: 'Jane Smith',
                phone: '9876543211',
                time: '12:45',
                date: new Date().toLocaleDateString(),
                status: 'preparing',
                items: [
                    { name: 'Vegetable Noodles', quantity: 2, price: 130, total: 260 }
                ],
                total: 260,
                paymentMethod: 'upi'
            }
        ];
        
        allOrders = sampleOrders;
        localStorage.setItem('allOrders', JSON.stringify(sampleOrders));
        localStorage.setItem('orders_count', sampleOrders.length);
    }
}

// Function to add a new order
function placeOrder(orderDetails) {
    // Generate order ID
    const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
    
    // Create order object
    const newOrder = {
        id: orderId,
        customer: orderDetails.fullname,
        phone: orderDetails.phone,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: new Date().toLocaleDateString(),
        status: 'new',
        items: orderDetails.items,
        total: orderDetails.total,
        paymentMethod: orderDetails.paymentMethod
    };
    
    // Get fresh data before adding new order
    const currentOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
    currentOrders.push(newOrder);
    
    // Update local array and localStorage
    allOrders = currentOrders;
    localStorage.setItem('allOrders', JSON.stringify(currentOrders));
    
    // This is crucial - trigger storage event in other windows
    localStorage.setItem('lastOrderId', orderId);
    localStorage.setItem('lastOrderTime', new Date().getTime().toString());
    
    console.log('Order placed successfully:', orderId);
    return orderId;
}

// Function to update order status
function updateOrderStatus(orderId, newStatus) {
    // Get fresh data
    const currentOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
    const orderIndex = currentOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        // Convert 'delivered' to 'completed' for backward compatibility
        if (newStatus === 'delivered') {
            newStatus = 'completed';
        }
        
        currentOrders[orderIndex].status = newStatus;
        
        // Update local array and localStorage
        allOrders = currentOrders;
        localStorage.setItem('allOrders', JSON.stringify(currentOrders));
        
        // Trigger storage event
        localStorage.setItem('lastOrderUpdate', Date.now().toString());
        
        console.log(`Order ${orderId} status updated to ${newStatus}`);
        return true;
    }
    
    console.log(`Failed to update order ${orderId} - not found`);
    return false;
}

// Function to get all orders
function getAllOrders() {
    // Get fresh data from localStorage
    const freshData = JSON.parse(localStorage.getItem('allOrders')) || [];
    allOrders = freshData;
    return allOrders;
}

// Function to get order by ID
function getOrderById(orderId) {
    // Get fresh data from localStorage
    getAllOrders();
    return allOrders.find(order => order.id === orderId);
}

// Function to get orders by status
function getOrdersByStatus(status) {
    // Get fresh data from localStorage
    getAllOrders();
    
    if (status === 'all') {
        return allOrders;
    }
    
    // Handle both 'delivered' and 'completed' statuses for backward compatibility
    if (status === 'completed') {
        return allOrders.filter(order => order.status === 'completed' || order.status === 'delivered');
    }
    
    return allOrders.filter(order => order.status === status);
}

// Function to check for new orders
function checkForNewOrders() {
    const cachedCount = localStorage.getItem('orders_count') || 0;
    const currentOrders = getAllOrders();
    
    if (currentOrders.length > cachedCount) {
        console.log(`New orders detected: ${cachedCount} -> ${currentOrders.length}`);
        localStorage.setItem('orders_count', currentOrders.length);
        
        if (isKitchenDashboard() && typeof renderOrders === 'function') {
            renderOrders(currentOrders);
            
            // Show notification
            if (Notification.permission === 'granted') {
                new Notification('New Order Received', {
                    body: 'A new order has been placed',
                    icon: 'images/logo.png'
                });
            } else {
                alert('New order received!');
            }
        }
    }
}

// Check if this is being loaded in the kitchen dashboard context
function isKitchenDashboard() {
    return window.location.href.includes('kitchen-dashboard');
}

// Auto-initialize if this is the kitchen dashboard
if (isKitchenDashboard()) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Kitchen dashboard initialized');
        
        // Initial render
        const orders = getAllOrders();
        localStorage.setItem('orders_count', orders.length);
        
        if (typeof renderOrders === 'function') {
            console.log('Initial render:', orders.length, 'orders');
            renderOrders(orders);
        }
        
        // Listen for storage events from other windows
        window.addEventListener('storage', function(e) {
            console.log('Storage event detected:', e.key);
            
            // Special trigger keys
            if (e.key === 'lastOrderId' || e.key === 'lastOrderTime' || e.key === 'lastOrderUpdate') {
                console.log('Order update detected');
                
                // Refresh the orders list
                const orders = getAllOrders();
                if (typeof renderOrders === 'function') {
                    console.log('Refreshing orders from storage event');
                    renderOrders(orders);
                }
                
                // Show notification for new orders
                if (e.key === 'lastOrderId' || e.key === 'lastOrderTime') {
                    if (Notification.permission === 'granted') {
                        new Notification('New Order Received', {
                            body: 'A new order has been placed',
                            icon: 'images/logo.png'
                        });
                    } else {
                        alert('New order received!');
                    }
                }
            }
        });
        
        // Request notification permission
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
        
        // Set up periodic refresh as a fallback
        setInterval(function() {
            const orders = getAllOrders();
            if (typeof renderOrders === 'function') {
                renderOrders(orders);
            }
        }, 5000); // Refresh every 5 seconds
    });
} 
function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutList = document.getElementById('checkout-list');
    const checkoutTotal = document.getElementById('checkout-total');

    checkoutList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="checkout-item">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        checkoutList.appendChild(li);
        total += item.price * item.quantity;
    });

    checkoutTotal.textContent = total.toFixed(2);
}

function handlePaymentMethodChange() {
    const paymentMethod = document.getElementById('payment-method').value;
    const cardDetails = document.getElementById('card-details');
    const bankDetails = document.getElementById('bank-details');
    const codDetails = document.getElementById('cod-details');

    cardDetails.style.display = paymentMethod === 'card' ? 'block' : 'none';
    bankDetails.style.display = paymentMethod === 'bank' ? 'block' : 'none';
    codDetails.style.display = paymentMethod === 'cod' ? 'block' : 'none';
}

function handleCheckoutSubmit(event) {
    event.preventDefault();

    // Simple validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (!name || !email || !address || !city || !zip || !paymentMethod) {
        alert('Please fill in all required fields.');
        return;
    }

    // Validate payment method specific fields
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        if (!cardNumber || !expiry || !cvv) {
            alert('Please fill in all card details.');
            return;
        }
    }

    // Simulate order placement
    const order = {
        id: Date.now(),
        items: JSON.parse(localStorage.getItem('cart')) || [],
        total: parseFloat(document.getElementById('checkout-total').textContent),
        shipping: { name, email, address, city, zip },
        paymentMethod: paymentMethod,
        status: 'Processing',
        date: new Date().toISOString()
    };

    // Store order in localStorage (for order history)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Add to user history if logged in
    if (window.currentUser) {
        window.addOrderToHistory(order);
    }

    // Clear cart
    localStorage.removeItem('cart');

    // Show confirmation with order ID
    alert(`Order placed successfully! Your Order ID is: ${order.id}. Thank you for shopping with us.`);

    // Redirect to home
    window.location.href = 'index.html';
}

function handleTrackOrder() {
    const orderId = prompt('Enter your Order ID:');
    if (orderId) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id == orderId);
        if (order) {
            alert(`Order Status: ${order.status}\nOrder Date: ${new Date(order.date).toLocaleDateString()}\nTotal: $${order.total.toFixed(2)}`);
        } else {
            alert('Order not found. Please check your Order ID.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCheckout();
    document.getElementById('checkout-form').addEventListener('submit', handleCheckoutSubmit);
    document.getElementById('payment-method').addEventListener('change', handlePaymentMethodChange);
    document.getElementById('track-order-btn').addEventListener('click', handleTrackOrder);
});

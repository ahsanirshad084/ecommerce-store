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

function handleCheckoutSubmit(event) {
    event.preventDefault();

    // Simple validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if (!name || !email || !address || !city || !zip || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all fields.');
        return;
    }

    // Simulate order placement
    const order = {
        id: Date.now(),
        items: JSON.parse(localStorage.getItem('cart')) || [],
        total: parseFloat(document.getElementById('checkout-total').textContent),
        shipping: { name, email, address, city, zip },
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

    // Show confirmation
    alert('Order placed successfully! Thank you for shopping with us.');

    // Redirect to home
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadCheckout();
    document.getElementById('checkout-form').addEventListener('submit', handleCheckoutSubmit);
});

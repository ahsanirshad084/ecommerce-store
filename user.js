let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function registerUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        alert('User already exists.');
        return false;
    }
    users.push({ username, email, password, orders: [] });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

function getOrderHistory() {
    if (!currentUser) return [];
    return currentUser.orders || [];
}

function addOrderToHistory(order) {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex].orders = users[userIndex].orders || [];
        users[userIndex].orders.push(order);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Handle login form
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (loginUser(username, password)) {
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials.');
        }
    });
}

// Handle register form
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (registerUser(username, email, password)) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        }
    });
}

// For order history page, if we create one
function displayOrderHistory() {
    const orders = getOrderHistory();
    const historyContainer = document.getElementById('order-history');
    historyContainer.innerHTML = '';
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <ul>
                ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
            </ul>
        `;
        historyContainer.appendChild(orderDiv);
    });
}

// Modify checkout.js to add order to history
// In checkout.js, after storing order, call addOrderToHistory(order);

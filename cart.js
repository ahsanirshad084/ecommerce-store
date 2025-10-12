let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({name, price, quantity: 1});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function setQuantity(index, value) {
    const qty = parseInt(value);
    if (qty > 0) {
        cart[index].quantity = qty;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="cart-item">
                <span>${item.name} - $${item.price}</span>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="setQuantity(${index}, this.value)">
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
            </div>
        `;
        cartList.appendChild(li);
        total += parseFloat(item.price) * item.quantity;
    });
    cartTotal.textContent = total.toFixed(2);

    // Add checkout button if cart is not empty
    if (cart.length > 0) {
        const checkoutBtn = document.createElement('a');
        checkoutBtn.href = 'checkout.html';
        checkoutBtn.className = 'checkout-btn';
        checkoutBtn.textContent = 'Proceed to Checkout';
        document.getElementById('cart-content').appendChild(checkoutBtn);
    }
}

window.onload = function() {
    updateCart();
    const showCartBtn = document.getElementById('show-cart-btn');
    const toggleCart = document.getElementById('toggle-cart');
    if (showCartBtn) showCartBtn.addEventListener('click', function() {
        const cart = document.getElementById('cart-section');
        cart.classList.remove('hidden');
    });
    if (toggleCart) toggleCart.addEventListener('click', function() {
        const cart = document.getElementById('cart-section');
        cart.classList.add('hidden');
    });
};

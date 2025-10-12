let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addToWishlist(name, price) {
    if (!wishlist.find(item => item.name === name)) {
        wishlist.push({ name, price });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${name} added to wishlist!`);
    } else {
        alert(`${name} is already in wishlist.`);
    }
}

function removeFromWishlist(name) {
    wishlist = wishlist.filter(item => item.name !== name);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function isInWishlist(name) {
    return wishlist.some(item => item.name === name);
}

// Function to display wishlist (can be used in a wishlist page if created)
function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlist-container');
    if (!wishlistContainer) return;
    wishlistContainer.innerHTML = '';
    wishlist.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'wishlist-item';
        itemDiv.innerHTML = `
            <span>${item.name} - $${item.price}</span>
            <button onclick="removeFromWishlist('${item.name}'); displayWishlist();">Remove</button>
        `;
        wishlistContainer.appendChild(itemDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayWishlist();
});

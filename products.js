// Product data (shared with product-detail.js for consistency)
const products = [
    {
        name: "Smartphone",
        price: 299,
        description: "Latest smartphone with advanced camera and battery life.",
        category: "electronics",
        rating: 4.5,
        stock: 50,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "John", rating: 5, comment: "Great phone!" },
            { user: "Jane", rating: 4, comment: "Good value." }
        ]
    },
    {
        name: "Laptop",
        price: 999,
        description: "High-performance laptop for work and gaming.",
        category: "electronics",
        rating: 5.0,
        stock: 20,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Bob", rating: 5, comment: "Excellent performance." }
        ]
    },
    {
        name: "Headphones",
        price: 49,
        description: "Wireless headphones with noise cancellation.",
        category: "electronics",
        rating: 4.2,
        stock: 100,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Alice", rating: 4, comment: "Comfortable." }
        ]
    },
    {
        name: "Tablet",
        price: 499,
        description: "Versatile tablet for work and entertainment.",
        category: "electronics",
        rating: 4.3,
        stock: 30,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Charlie", rating: 4, comment: "Nice screen." }
        ]
    },
    {
        name: "Smartwatch",
        price: 199,
        description: "Fitness tracking smartwatch with notifications.",
        category: "electronics",
        rating: 4.8,
        stock: 40,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Diana", rating: 5, comment: "Love it!" }
        ]
    },
    {
        name: "T-Shirt",
        price: 19,
        description: "Comfortable cotton t-shirt for everyday wear.",
        category: "fashion",
        rating: 4.4,
        stock: 200,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Eve", rating: 4, comment: "Soft fabric." }
        ]
    },
    {
        name: "Jeans",
        price: 59,
        description: "Slim-fit jeans in classic blue.",
        category: "fashion",
        rating: 4.7,
        stock: 150,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Frank", rating: 5, comment: "Perfect fit." }
        ]
    },
    {
        name: "Shoes",
        price: 79,
        description: "Casual sneakers for all-day comfort.",
        category: "fashion",
        rating: 4.1,
        stock: 80,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Grace", rating: 4, comment: "Comfortable." }
        ]
    },
    {
        name: "Dress",
        price: 89,
        description: "Elegant summer dress with floral print.",
        category: "fashion",
        rating: 4.9,
        stock: 60,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Helen", rating: 5, comment: "Beautiful." }
        ]
    },
    {
        name: "Hat",
        price: 25,
        description: "Stylish baseball cap for casual outings.",
        category: "fashion",
        rating: 4.0,
        stock: 120,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Ian", rating: 4, comment: "Nice design." }
        ]
    },
    {
        name: "Lamp",
        price: 29,
        description: "Modern desk lamp with adjustable brightness.",
        category: "home-garden",
        rating: 4.6,
        stock: 90,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Jack", rating: 5, comment: "Bright light." }
        ]
    },
    {
        name: "Vase",
        price: 15,
        description: "Ceramic vase perfect for fresh flowers.",
        category: "home-garden",
        rating: 4.8,
        stock: 70,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Kate", rating: 5, comment: "Elegant." }
        ]
    },
    {
        name: "Plant Pot",
        price: 12,
        description: "Stylish pot for indoor plants.",
        category: "home-garden",
        rating: 4.3,
        stock: 110,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Leo", rating: 4, comment: "Good quality." }
        ]
    },
    {
        name: "Rug",
        price: 99,
        description: "Soft area rug to warm up your space.",
        category: "home-garden",
        rating: 4.7,
        stock: 25,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Mia", rating: 5, comment: "Cozy." }
        ]
    },
    {
        name: "Toolset",
        price: 45,
        description: "Complete toolset for DIY projects.",
        category: "home-garden",
        rating: 4.4,
        stock: 35,
        images: ["malik.webp", "malik.webp", "malik.webp"],
        reviews: [
            { user: "Noah", rating: 4, comment: "Useful." }
        ]
    }
];

function displayProducts(productList = products) {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '';
    productList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-name', product.name);
        card.setAttribute('data-category', product.category);
        card.setAttribute('data-price', product.price);
        card.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <p>Rating: ${product.rating} ★</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            <button onclick="addToWishlist('${product.name}', ${product.price})">Add to Wishlist</button>
            <a href="product-detail.html?name=${encodeURIComponent(product.name)}">View Details</a>
        `;
        container.appendChild(card);
    });
}

function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const cardCategory = card.getAttribute('data-category');
        const price = parseFloat(card.getAttribute('data-price'));
        const matchesQuery = name.includes(query);
        const matchesCategory = !category || cardCategory === category;
        const matchesPrice = price >= minPrice && price <= maxPrice;
        card.style.display = (matchesQuery && matchesCategory && matchesPrice) ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    const searchInput = document.getElementById('search-input');
    const applyFilters = document.getElementById('apply-filters');
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (applyFilters) applyFilters.addEventListener('click', filterProducts);
});

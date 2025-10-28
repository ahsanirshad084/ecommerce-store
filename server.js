const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-app-password' // Replace with your app password
    }
});

// Database setup
const db = new sqlite3.Database('./ecommerce.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Products table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            category TEXT,
            rating REAL,
            stock INTEGER,
            images TEXT
        )`);

        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

        // Orders table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total REAL NOT NULL,
            shipping TEXT,
            date TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Order items table
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id)
        )`);

        // Cart items table (for persistence)
        db.run(`CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Wishlist items table
        db.run(`CREATE TABLE IF NOT EXISTS wishlist_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_name TEXT NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Insert sample products if not exists
        insertSampleProducts();
    });
}

// Insert sample products
function insertSampleProducts() {
    const products = [
        { name: "Smartphone", price: 299, description: "Latest smartphone with advanced camera and battery life.", category: "electronics", rating: 4.5, stock: 50, images: "malik.webp" },
        { name: "Laptop", price: 999, description: "High-performance laptop for work and gaming.", category: "electronics", rating: 5.0, stock: 20, images: "malik.webp" },
        { name: "Headphones", price: 49, description: "Wireless headphones with noise cancellation.", category: "electronics", rating: 4.2, stock: 100, images: "malik.webp" },
        { name: "Tablet", price: 499, description: "Versatile tablet for work and entertainment.", category: "electronics", rating: 4.3, stock: 30, images: "malik.webp" },
        { name: "Smartwatch", price: 199, description: "Fitness tracking smartwatch with notifications.", category: "electronics", rating: 4.8, stock: 40, images: "malik.webp" },
        { name: "T-Shirt", price: 19, description: "Comfortable cotton t-shirt for everyday wear.", category: "fashion", rating: 4.4, stock: 200, images: "malik.webp" },
        { name: "Jeans", price: 59, description: "Slim-fit jeans in classic blue.", category: "fashion", rating: 4.7, stock: 150, images: "malik.webp" },
        { name: "Shoes", price: 79, description: "Casual sneakers for all-day comfort.", category: "fashion", rating: 4.1, stock: 80, images: "malik.webp" },
        { name: "Dress", price: 89, description: "Elegant summer dress with floral print.", category: "fashion", rating: 4.9, stock: 60, images: "malik.webp" },
        { name: "Hat", price: 25, description: "Stylish baseball cap for casual outings.", category: "fashion", rating: 4.0, stock: 120, images: "malik.webp" },
        { name: "Lamp", price: 29, description: "Modern desk lamp with adjustable brightness.", category: "home-garden", rating: 4.6, stock: 90, images: "malik.webp" },
        { name: "Vase", price: 15, description: "Ceramic vase perfect for fresh flowers.", category: "home-garden", rating: 4.8, stock: 70, images: "malik.webp" },
        { name: "Plant Pot", price: 12, description: "Stylish pot for indoor plants.", category: "home-garden", rating: 4.3, stock: 110, images: "malik.webp" },
        { name: "Rug", price: 99, description: "Soft area rug to warm up your space.", category: "home-garden", rating: 4.7, stock: 25, images: "malik.webp" },
        { name: "Toolset", price: 45, description: "Complete toolset for DIY projects.", category: "home-garden", rating: 4.4, stock: 35, images: "malik.webp" }
    ];

    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (err) console.error(err);
        else if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO products (name, price, description, category, rating, stock, images) VALUES (?, ?, ?, ?, ?, ?, ?)");
            products.forEach(product => {
                stmt.run(product.name, product.price, product.description, product.category, product.rating, product.stock, product.images);
            });
            stmt.finalize();
            console.log('Sample products inserted.');
        }
    });
}

// API Routes

// Welcome endpoint
app.get('/api/welcome', (req, res) => {
    console.log(`Request received: ${req.method} ${req.path}`);
    res.json({ message: 'Welcome to the Ecommerce Store API!' });
});

// Get all products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get product by name
app.get('/api/products/:name', (req, res) => {
    const name = req.params.name;
    db.get("SELECT * FROM products WHERE name = ?", [name], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            // Add reviews (mock for now, could be stored in DB)
            row.reviews = [
                { user: "John", rating: 5, comment: "Great product!" },
                { user: "Jane", rating: 4, comment: "Good value." }
            ];
            res.json(row);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});

// User registration
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, password], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, message: 'User registered successfully' });
    });
});

// User login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ user: row, message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Get user orders
app.get('/api/orders/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all("SELECT * FROM orders WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Get order items for each order
        const ordersWithItems = rows.map(order => {
            return new Promise((resolve) => {
                db.all("SELECT * FROM order_items WHERE order_id = ?", [order.id], (err, items) => {
                    order.items = items;
                    resolve(order);
                });
            });
        });
        Promise.all(ordersWithItems).then(orders => res.json(orders));
    });
});

// Create order
app.post('/api/orders', (req, res) => {
    const { userId, items, total, shipping } = req.body;
    const date = new Date().toISOString();
    db.run("INSERT INTO orders (user_id, total, shipping, date) VALUES (?, ?, ?, ?)", [userId, total, JSON.stringify(shipping), date], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const orderId = this.lastID;
        // Insert order items
        const stmt = db.prepare("INSERT INTO order_items (order_id, product_name, price, quantity) VALUES (?, ?, ?, ?)");
        items.forEach(item => {
            stmt.run(orderId, item.name, item.price, item.quantity);
        });
        stmt.finalize();

        // Send email notification
        sendOrderNotification(shipping.email, orderId, items, total, shipping);

        res.json({ id: orderId, message: 'Order placed successfully' });
    });
});

// Get cart for user
app.get('/api/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all("SELECT * FROM cart_items WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const { userId, productName, price, quantity } = req.body;
    db.run("INSERT OR REPLACE INTO cart_items (user_id, product_name, price, quantity) VALUES (?, ?, ?, ?)", [userId, productName, price, quantity], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item added to cart' });
    });
});

// Update cart item
app.put('/api/cart/:id', (req, res) => {
    const { quantity } = req.body;
    db.run("UPDATE cart_items SET quantity = ? WHERE id = ?", [quantity, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cart updated' });
    });
});

// Remove from cart
app.delete('/api/cart/:id', (req, res) => {
    db.run("DELETE FROM cart_items WHERE id = ?", [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item removed from cart' });
    });
});

// Get wishlist for user
app.get('/api/wishlist/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all("SELECT * FROM wishlist_items WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add to wishlist
app.post('/api/wishlist', (req, res) => {
    const { userId, productName, price } = req.body;
    db.run("INSERT INTO wishlist_items (user_id, product_name, price) VALUES (?, ?, ?)", [userId, productName, price], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item added to wishlist' });
    });
});

// Remove from wishlist
app.delete('/api/wishlist/:userId/:productName', (req, res) => {
    const { userId, productName } = req.params;
    db.run("DELETE FROM wishlist_items WHERE user_id = ? AND product_name = ?", [userId, productName], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item removed from wishlist' });
    });
});

// Email notification function
function sendOrderNotification(customerEmail, orderId, items, total, shipping) {
    const itemsList = items.map(item => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');

    const mailOptions = {
        from: 'your-email@gmail.com', // Replace with your email
        to: customerEmail,
        subject: `Order Confirmation - Order ID: ${orderId}`,
        text: `
Dear ${shipping.name},

Thank you for your order! Here are the details:

Order ID: ${orderId}
Order Date: ${new Date().toLocaleDateString()}

Shipping Address:
${shipping.name}
${shipping.address}
${shipping.city}, ${shipping.zip}

Items Ordered:
${itemsList}

Total: $${total.toFixed(2)}

We will process your order shortly. You will receive another email when your order ships.

Best regards,
Ecommerce Store Team
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Account Class
class Account {
    constructor(id, name, email, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role; // "Admin" or "Member"
        this.isBlocked = false;
    }

    blockMember(member) {
        if (this.role === "Admin") {
            member.isBlocked = true;
            console.log(`${member.name} has been blocked.`);
        } else {
            console.log("Only admins can block members.");
        }
    }

    unblockMember(member) {
        if (this.role === "Admin") {
            member.isBlocked = false;
            console.log(`${member.name} has been unblocked.`);
        } else {
            console.log("Only admins can unblock members.");
        }
    }
}

// Guest Class
class Guest {
    constructor() {
        this.cart = new ShoppingCart();
    }

    viewProducts(catalog) {
        return catalog.getAllProducts();
    }

    addToCart(item) {
        this.cart.addItem(item);
    }

    register(name, email) {
        return new Account(Date.now(), name, email, "Member");
    }
}

// Catalog Class
class Catalog {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
    }

    searchByName(name) {
        return this.products.filter(product => product.name.toLowerCase().includes(name.toLowerCase()));
    }

    searchByCategory(category) {
        return this.products.filter(product => product.category.name === category);
    }

    getAllProducts() {
        return this.products;
    }
}

// ProductCategory Class
class ProductCategory {
    constructor(name) {
        this.name = name;
    }
}

// Product Class
class Product {
    constructor(id, name, price, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.reviews = [];
        this.items = [];
    }

    addReview(review) {
        this.reviews.push(review);
    }

    addItem(item) {
        this.items.push(item);
    }
}

// ProductReview Class
class ProductReview {
    constructor(rating, comment, member) {
        this.rating = rating;
        this.comment = comment;
        this.member = member;
    }
}

// ShoppingCart Class
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    clear() {
        this.items = [];
    }
}

// Item Class
class Item {
    constructor(id, product, price) {
        this.id = id;
        this.product = product;
        this.price = price;
    }
}

// Order Class
class Order {
    constructor(orderId, items, member) {
        this.orderId = orderId;
        this.items = items;
        this.member = member;
        this.status = "Unshipped";
        this.totalAmount = items.reduce((total, item) => total + item.price, 0);
    }
}

// OrderLog Class
class OrderLog {
    constructor() {
        this.orders = [];
    }

    addOrder(order) {
        this.orders.push(order);
    }

    updateOrderStatus(orderId, status) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            order.status = status;
        }
    }
}

// ShipmentLog Class
class ShipmentLog {
    constructor() {
        this.shipments = [];
    }

    addShipment(orderId, status) {
        this.shipments.push({ orderId, status });
    }

    updateShipmentStatus(orderId, status) {
        const shipment = this.shipments.find(s => s.orderId === orderId);
        if (shipment) {
            shipment.status = status;
        }
    }
}

// Notification Class
class Notification {
    static sendNotification(member, message) {
        console.log(`Notification to ${member.name}: ${message}`);
    }
}

// Payment Class
class Payment {
    constructor(orderId, amount, method) {
        this.orderId = orderId;
        this.amount = amount;
        this.method = method; // "CreditCard" or "BankTransfer"
    }

    processPayment() {
        console.log(`Payment of $${this.amount} processed via ${this.method}`);
    }
}

// Example Usage
const admin = new Account(1, "AdminUser", "admin@example.com", "Admin");
const guest = new Guest();

// Catalog and Categories
const catalog = new Catalog();
const electronics = new ProductCategory("Electronics");
const books = new ProductCategory("Books");

catalog.addProduct(new Product(1, "Smartphone", 699, electronics));
catalog.addProduct(new Product(2, "Laptop", 999, electronics));
catalog.addProduct(new Product(3, "JavaScript Book", 25, books));

// Guest Browsing
console.log("All Products:", guest.viewProducts(catalog));

// Guest Registering
const member = guest.register("John Doe", "john@example.com");

// Add to Cart
guest.addToCart(new Item(1, "Laptop", 999));
console.log("Cart Total:", guest.cart.getTotal());

// Admin Blocking Member
admin.blockMember(member);

// Order Processing
const order = new Order("ORD001", guest.cart.items, member);
const orderLog = new OrderLog();
orderLog.addOrder(order);
console.log("Order Created:", order);

// Payment
const payment = new Payment(order.orderId, order.totalAmount, "CreditCard");
payment.processPayment();

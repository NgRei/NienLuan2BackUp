-- Create the database
CREATE DATABASE ql_shopmohinh;
USE ql_shopmohinh;

-- Create the category table
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    status TINYINT DEFAULT 1
);

-- Create the product table
CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_san_pham VARCHAR(255) NOT NULL,
    gia DECIMAL(10, 2) NOT NULL,
    category_id INT,
    noi_xuat_xu VARCHAR(255),
    hang_san_xuat VARCHAR(255),
    nam_san_xuat INT,
    so_luong INT,
    mo_ta TEXT,
    hinh_anh VARCHAR(255),
    status TINYINT DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TINYINT DEFAULT 1
);

-- Create the orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    status TINYINT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the order_items table (chi tiết đơn hàng)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Create the carts table
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Create the payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'credit_card', 'bank_transfer', 'momo', 'zalopay') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);


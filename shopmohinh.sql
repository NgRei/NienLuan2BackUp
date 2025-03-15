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

-- Insert data into the category table
INSERT INTO category (category_name, status) VALUES ('Xe', 1);
INSERT INTO category (category_name, status) VALUES ('Figure', 1);
INSERT INTO category (category_name, status) VALUES ('Robot', 1);
INSERT INTO category (category_name, status) VALUES ('Kiến trúc', 1);
INSERT INTO category (category_name, status) VALUES ('Lắp ráp', 1);

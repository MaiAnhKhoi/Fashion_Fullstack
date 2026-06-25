-- =========================
-- SIZES
-- =========================

INSERT INTO sizes(name) VALUES
('S'),
('M'),
('L'),
('XL'),
('XXL');

-- =========================
-- COLORS
-- =========================

INSERT INTO colors(name,label,css_class,hex) VALUES
('White','White','bg-white','#FFFFFF'),
('Black','Black','bg-black','#000000'),
('Blue','Blue','bg-blue','#2563EB'),
('Red','Red','bg-red','#DC2626'),
('Grey','Grey','bg-grey','#6B7280');

-- =========================
-- BRANDS
-- =========================

INSERT INTO brands
(name,slug,logo_url)
VALUES
('Nike','nike','/images/brands/nike.png'),
('Adidas','adidas','/images/brands/adidas.png'),
('Puma','puma','/images/brands/puma.png');

-- =========================
-- CATEGORIES
-- =========================

INSERT INTO product_categories
(name,slug)
VALUES
('Men','men'),
('Women','women'),
('T-Shirt','t-shirt'),
('Hoodie','hoodie');

-- =========================
-- PRODUCTS
-- =========================

INSERT INTO products
(
title,
slug,
description,
base_price,
old_price,
sale_label,
status
)
VALUES

(
'Basic White T-Shirt',
'basic-white-tshirt',
'Premium cotton t-shirt',
199000,
249000,
'20% OFF',
'active'
),

(
'Oversized Black T-Shirt',
'oversized-black-tshirt',
'Oversized streetwear style',
259000,
299000,
'15% OFF',
'active'
),

(
'Classic Blue Hoodie',
'classic-blue-hoodie',
'Warm hoodie for winter',
499000,
599000,
'17% OFF',
'active'
),

(
'Red Sport Hoodie',
'red-sport-hoodie',
'Comfortable hoodie',
549000,
649000,
'15% OFF',
'active'
),

(
'Grey Casual Tee',
'grey-casual-tee',
'Daily casual wear',
189000,
229000,
'17% OFF',
'active'
);

-- =========================
-- PRODUCT IMAGES
-- =========================

INSERT INTO product_images
(product_id,url,is_main)
VALUES

(1,'/images/products/product-1.jpg',1),
(1,'/images/products/product-1-2.jpg',0),

(2,'/images/products/product-2.jpg',1),
(2,'/images/products/product-2-2.jpg',0),

(3,'/images/products/product-3.jpg',1),
(3,'/images/products/product-3-2.jpg',0),

(4,'/images/products/product-4.jpg',1),
(4,'/images/products/product-4-2.jpg',0),

(5,'/images/products/product-5.jpg',1);

-- =========================
-- PRODUCT BRANDS
-- =========================

INSERT INTO product_brands
(product_id,brand_id)
VALUES

(1,1),
(2,1),
(3,2),
(4,2),
(5,3);

-- =========================
-- PRODUCT CATEGORY MAP
-- =========================

INSERT INTO product_category_map
(product_id,category_id)
VALUES

(1,1),
(1,3),

(2,1),
(2,3),

(3,1),
(3,4),

(4,2),
(4,4),

(5,2),
(5,3);

-- =========================
-- PRODUCT VARIANTS
-- =========================

INSERT INTO product_variants
(
product_id,
size_id,
color_id,
sku,
price,
stock
)
VALUES

(1,1,1,'TSHIRT-WHITE-S',199000,20),
(1,2,1,'TSHIRT-WHITE-M',199000,25),
(1,3,1,'TSHIRT-WHITE-L',199000,15),

(2,1,2,'TSHIRT-BLACK-S',259000,10),
(2,2,2,'TSHIRT-BLACK-M',259000,12),
(2,3,2,'TSHIRT-BLACK-L',259000,8),

(3,2,3,'HOODIE-BLUE-M',499000,20),
(3,3,3,'HOODIE-BLUE-L',499000,15),

(4,2,4,'HOODIE-RED-M',549000,10),
(4,3,4,'HOODIE-RED-L',549000,12),

(5,1,5,'TEE-GREY-S',189000,30),
(5,2,5,'TEE-GREY-M',189000,20);

-- =========================
-- VARIANT IMAGES
-- =========================

INSERT INTO product_variant_images
(product_variant_id,url,is_main)
VALUES

(1,'/images/products/product-1-white.jpg',1),
(2,'/images/products/product-1-white.jpg',1),
(3,'/images/products/product-1-white.jpg',1),

(4,'/images/products/product-2-black.jpg',1),
(5,'/images/products/product-2-black.jpg',1),

(7,'/images/products/product-3-blue.jpg',1),
(8,'/images/products/product-3-blue.jpg',1),

(9,'/images/products/product-4-red.jpg',1),
(10,'/images/products/product-4-red.jpg',1),

(11,'/images/products/product-5-grey.jpg',1),
(12,'/images/products/product-5-grey.jpg',1);
DROP TABLE IF EXISTS sales;

CREATE TABLE sales(
	sale_id INT AUTO_INCREMENT PRIMARY KEY,
	medicine_id INT NOT NULL,
    quantity INT NOT NULL,
    order_id INT NOT NULL
);
DROP TABLE IF EXISTS medicine_order;

CREATE TABLE medicine_order(
	medicine_order_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_first_name VARCHAR(256) NOT NULL,
    patient_last_name VARCHAR(256) NOT NULL,
    order_date Date NOT NULL,
    order_id INT NOT NULL
);
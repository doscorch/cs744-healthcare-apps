DROP TABLE IF EXISTS medicines;

CREATE TABLE medicines(
    medicine_id INT NOT NULL AUTO_INCREMENT,
	medicine_code VARCHAR(256) NOT NULL,
	medical_name VARCHAR(256) NOT NULL,
	commercial_name VARCHAR(256) NOT NULL,
    medicine_type INTEGER NOT NULL,
	recommended_dosage VARCHAR(256) NOT NULL,
    quantity INTEGER NOT NULL,
    vendor VARCHAR(256) NOT NULL,
	expiration_date DATETIME NOT NULL,
    cost DECIMAL(6,2) NOT NULL,
    primary key (medicine_id)
);
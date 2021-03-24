DROP TABLE IF EXISTS patients;

CREATE TABLE patients(
    patient_id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(256),
    last_name VARCHAR(256),
	birth_date DATETIME NOT NULL,
    address VARCHAR(256),
	city VARCHAR(256),
    state VARCHAR(256),
    zipcode VARCHAR(256),
    primary key (patient_id)
);
DROP TABLE IF EXISTS prescriptions;

CREATE TABLE prescriptions(
    prescription_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_first_name VARCHAR(256) NOT NULL,
    patient_last_name VARCHAR(256) NOT NULL,
    patient_address VARCHAR(256) NOT NULL,
    patient_date_of_birth DATE NOT NULL,
    physician_first_name VARCHAR(256) NOT NULL,
    physician_last_name VARCHAR(256) NOT NULL,
    physician_institution VARCHAR(256) NOT NULL,
    physician_license_number VARCHAR(256) NOT NULL,
    prescription VARCHAR(256) NOT NULL,
	dosage VARCHAR(256) NOT NULL,
    quantity INT NOT NULL,
    refill INT NOT NULL,
    order_date Date NOT NULL,
	order_status INT NOT NULL
);
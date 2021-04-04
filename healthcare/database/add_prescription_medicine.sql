DROP TABLE IF EXISTS prescription_medicine;

CREATE TABLE prescription_medicine(
    prescription_medicine_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prescription_order_id INT NOT NULL,
    prescription VARCHAR(256) NOT NULL,
    dosage VARCHAR(128) NOT NULL,
    quantity INT NOT NULL,
    refill INT NOT NULL,
    CONSTRAINT fk_prescription_medicine
    FOREIGN KEY (prescription_order_id)
    REFERENCES prescription_order(prescription_id)
);
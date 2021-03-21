DROP TABLE IF EXISTS prescription;

CREATE TABLE prescription(
    prescription_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    physician_id INT NOT NULL,
    patient_id INT NOT NULL,
    prescription VARCHAR(512) NOT NULL,
    dosage VARCHAR(256) NOT NULL,
    quantity INT NOT NULL,
    refill INT NOT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_physician_prescription
    FOREIGN KEY (physician_id)
    REFERENCES user(user_id),
    CONSTRAINT fk_patient_prescription
    FOREIGN KEY (patient_id)
    REFERENCES user(user_id)
);
DROP TABLE IF EXISTS prescription_order;

CREATE TABLE prescription_order(
    prescription_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    physician_id INT NOT NULL,
    patient_id INT NOT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_physician_prescription
    FOREIGN KEY (physician_id)
    REFERENCES user(user_id),
    CONSTRAINT fk_patient_prescription
    FOREIGN KEY (patient_id)
    REFERENCES user(user_id)
);
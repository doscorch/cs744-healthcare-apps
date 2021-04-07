DROP TABLE IF EXISTS visitaion;

CREATE TABLE visitation(
    visitation_id INT AUTO_INCREMENT PRIMARY KEY,
    physician_id INT NOT NULL,
    patient_id INT NOT NULL,
    visitation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_physician_visitation
    FOREIGN KEY (physician_id)
    REFERENCES user(user_id),
    CONSTRAINT fk_patient_visitation
    FOREIGN KEY (patient_id)
    REFERENCES user(user_id)
);
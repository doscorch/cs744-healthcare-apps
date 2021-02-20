DROP TABLE IF EXISTS patient_physician;

CREATE TABLE patient_physician(
    patient_id INT NOT NULL,
    physician_id INT NOT NULL,
    CONSTRAINT fk_physician_id
    FOREIGN KEY ( physician_id )
        REFERENCES user( user_id ),
    CONSTRAINT fk_patient_id
    FOREIGN KEY ( patient_id )
        REFERENCES user(  user_id )
);
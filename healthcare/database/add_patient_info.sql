DROP TABLE IF EXISTS patient_info;

CREATE TABLE patient_info(
    user_id INT NOT NULL,
    date_of_birth DATETIME NOT NULL,
    address VARCHAR(256),
    CONSTRAINT fk_user_patient_info
    FOREIGN KEY ( user_id )
        REFERENCES user( user_id )
);
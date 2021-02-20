DROP TABLE IF EXISTS physician_info;

CREATE TABLE physician_info(
    user_id INT NOT NULL,
    license_number VARCHAR(63) NOT NULL,
    CONSTRAINT fk_user_physician_info
    FOREIGN KEY ( user_id )
        REFERENCES user( user_id )
);
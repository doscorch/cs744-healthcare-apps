DROP TABLE IF EXISTS request_hc;

CREATE TABLE request_hc(
    request_hc_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    request_hc_status INT NOT NULL,
    request_hc_date DATETIME NOT NULL,
    first_name VARCHAR(63) NOT NULL,
    last_name VARCHAR(63) NOT NULL,
    address VARCHAR(512) NOT NULL,
    date_of_birth DATETIME NOT NULL,
    amount DECIMAL(10,2),
    procedure_id INT,
    other_id INT,
    CONSTRAINT fk_procedure
    FOREIGN KEY (procedure_id)
        REFERENCES `procedure`(procedure_id)
);

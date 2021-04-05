DROP TABLE IF EXISTS request;

CREATE TABLE request(
    request_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    request_status INT NOT NULL,
    request_date DATETIME NOT NULL,
    first_name VARCHAR(63) NOT NULL,
    last_name VARCHAR(63) NOT NULL,
    address VARCHAR(512) NOT NULL,
    date_of_birth DATETIME NOT NULL,
    amount DECIMAL(10,2),
    drug_id INT,
    CONSTRAINT fk_drug_request
    FOREIGN KEY (drug_id)
        REFERENCES drug(drug_id)
);

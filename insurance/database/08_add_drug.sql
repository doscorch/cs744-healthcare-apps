DROP TABLE IF EXISTS drug;

CREATE TABLE drug(
    drug_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    drug_name VARCHAR(63) UNIQUE NOT NULL
);
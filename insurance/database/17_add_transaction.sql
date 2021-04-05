DROP TABLE IF EXISTS transaction;

CREATE TABLE transaction(
    transaction_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    transaction_date DATETIME NOT NULL,
    request_id INT NOT NULL,
    policy_holder_id INT NOT NULL,
    CONSTRAINT fk_ph_transaction
    FOREIGN KEY (policy_holder_id)
        REFERENCES policy_holder(policy_holder_id),
    CONSTRAINT fk_request
    FOREIGN KEY (request_id)
        REFERENCES request(request_id)
);

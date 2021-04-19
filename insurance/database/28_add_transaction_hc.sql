DROP TABLE IF EXISTS transaction_hc;

CREATE TABLE transaction_hc(
    transaction_hc_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    transaction_hc_date DATETIME NOT NULL,
    request_hc_id INT NOT NULL,
    policy_holder_id INT NOT NULL,
    CONSTRAINT fk_ph_transaction_hc
    FOREIGN KEY (policy_holder_id)
        REFERENCES policy_holder(policy_holder_id),
    CONSTRAINT fk_request_transaction_hc
    FOREIGN KEY (request_hc_id)
        REFERENCES request_hc(request_hc_id)
);

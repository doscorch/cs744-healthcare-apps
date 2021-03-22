DROP TABLE IF EXISTS policy_holder;

CREATE TABLE policy_holder(
    policy_holder_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(63) NOT NULL,
    last_name VARCHAR(63) NOT NULL,
    date_of_birth DATETIME NOT NULL,
    address VARCHAR(63) NOT NULL,
    policy_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    amount_remaining DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_policy
    FOREIGN KEY (policy_id)
        REFERENCES policy(policy_id)
);
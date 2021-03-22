DROP TABLE IF EXISTS policy_drug;

CREATE TABLE policy_drug(
    policy_drug_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    policy_id INT NOT NULL,
    drug_id INT NOT NULL,
    CONSTRAINT fk_policy_pd
    FOREIGN KEY ( policy_id )
        REFERENCES policy(policy_id),
    CONSTRAINT fk_drug_pd
    FOREIGN KEY (drug_id)
        REFERENCES drug(drug_id)
);
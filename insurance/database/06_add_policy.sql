DROP TABLE IF EXISTS policy;

CREATE TABLE policy(
    policy_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(63) UNIQUE NOT NULL,
    policy_name VARCHAR(63) NOT NULL,
    age_limit INT NOT NULL,
    max_coverage_per_year DECIMAL(10,2) NOT NULL,
    percent_coverage DECIMAL(6,4) NOT NULL,
    premium_per_month DECIMAL(10,2) NOT NULL
);
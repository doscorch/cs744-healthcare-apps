DROP TABLE IF EXISTS user;

CREATE TABLE user(
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(63) NOT NULL,
    password VARCHAR(512) NOT NULL,
    first_name VARCHAR(63) NOT NULL,
    last_name VARCHAR(63) NOT NULL,
    user_type INT NOT NULL,
    user_status INT NOT NULL,
);
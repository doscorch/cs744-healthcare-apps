DROP TABLE IF EXISTS security_question;

CREATE TABLE security_question(
    question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(600) NOT NULL
);
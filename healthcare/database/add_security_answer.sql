DROP TABLE IF EXISTS security_answer;

CREATE TABLE security_answer(
    answer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    answer: VARCHAR(600) NOT NULL,
    CONSTRAINT fk_question
    FOREIGN KEY ( question_id )
        REFERENCES security_question(question_id),
    CONSTRAINT fk_user
    FOREIGN KEY (user_id)
        REFERENCES user(user_id)
);
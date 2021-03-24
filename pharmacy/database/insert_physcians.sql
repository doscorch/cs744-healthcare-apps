DROP TABLE IF EXISTS physicians;

CREATE TABLE physicians(
    physician_id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(256),
    last_name VARCHAR(256),
	institution VARCHAR(256),
    license VARCHAR(256),
	primary key (physician_id)
);
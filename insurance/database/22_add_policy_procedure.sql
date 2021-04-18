CREATE TABLE `policy_procedure` (
  `policy_procedure_id` int NOT NULL AUTO_INCREMENT,
  `policy_id` int NOT NULL,
  `procedure_id` int NOT NULL,
  PRIMARY KEY (`policy_procedure_id`),
  KEY `fk_policy_pd` (`policy_id`),
  KEY `fk_procedure_pd` (`procedure_id`),
  CONSTRAINT `fk_policy_pd` FOREIGN KEY (`policy_id`) REFERENCES `policy` (`policy_id`),
  CONSTRAINT `fk_procedure_pd` FOREIGN KEY (`procedure_id`) REFERENCES `procedure` (`procedure_id`)
);

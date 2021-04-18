CREATE TABLE `procedure` (
  `procedure_id` int NOT NULL AUTO_INCREMENT,
  `procedure_id_hc` varchar(63) NOT NULL,
  `procedure_name` varchar(127) NOT NULL,
  `procedure_price` int NOT NULL,
  `procedure_table_data` varchar(1023) DEFAULT NULL,
  PRIMARY KEY (`procedure_id`)
);
ALTER TABLE `request`
ADD payload LONGTEXT;

ALTER TABLE `request`
ADD policy_holder_id INT NULL;

ALTER TABLE `request_hc`
ADD payload LONGTEXT;

ALTER TABLE `request_hc`
MODIFY COLUMN other_id INT NULL;

ALTER TABLE `request_hc`
MODIFY COLUMN `procedure_id` INT NULL;

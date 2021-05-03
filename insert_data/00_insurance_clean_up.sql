/* Delete request */

DELETE FROM `transaction`;

DELETE FROM request;

/* Delete request_hc */
DELETE FROM transaction_hc;

DELETE FROM request_hc;

/* Delete policies */

DELETE FROM policy_drug;
DELETE FROM policy_procedure;

DELETE FROM policy;

/* Delete drugs */

DELETE FROM drug;

/* Delete procedures */

DELETE FROM `procedure`;

/* Delete policy holders */

DELETE FROM policy_holder;



;
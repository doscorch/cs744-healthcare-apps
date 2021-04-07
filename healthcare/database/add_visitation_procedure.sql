DROP TABLE IF EXISTS visitation_procedure;

CREATE TABLE visitation_procedure(
    visitation_id INT NOT NULL,
    procedure_id VARCHAR(64) NOT NULL,
    CONSTRAINT fk_visitation_procedure
    FOREIGN KEY (visitation_id)
    REFERENCES visitation(visitation_id),
    CONSTRAINT fk_procedure_visitation
    FOREIGN KEY (procedure_id)
    REFERENCES medical_procedure(procedure_id)
);
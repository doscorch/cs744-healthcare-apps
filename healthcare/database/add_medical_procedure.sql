DROP TABLE IF EXISTS medical_procedure;

CREATE TABLE medical_procedure(
    procedure_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256),
    price FLOAT
);

INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('90281-90399','Immune Globulins, Serum or Recombinant Products', 1000.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('90460-0031A','Immunization Administration for Vaccines/Toxoids', 500.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('90476-90756','Vaccines, Toxoids', 250.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('90785-90899','Psychiatry Services and Procedures', 350.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('90901-90913','Biofeedback Services and Procedures', 100.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('90935-90999','Dialysis Services and Procedures', 750.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('91010-91299','Gastroenterology Procedures', 550.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('91300-91303','COVID-19 Vaccines/Toxoids', 75.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('92002-92499','Ophthalmology Services and Procedures', 275.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('92502-92700','Special Otorhinolaryngologic Services and Procedures', 800.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('92920-93799','Cardiovascular Procedures', 450.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('93880-93998','Non-Invasive Vascular Diagnostic Studies', 200.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('94002-94799','Pulmonary Procedures', 150.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('95004-95199','Allergy and Clinical Immunology Procedures', 500.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('95249-95251','Endocrinology Services', 600.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('95700-96020','Neurology and Neuromuscular Procedures', 775.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('96040-96040','Medical Genetics and Genetic Counseling Services', 1200.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('96105-96146','Central Nervous System Assessments/Tests (eg, Neuro-Cognitive, Mental Status, Speech Testing)', 475.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('96156-96171','Health Behavior Assessment and Intervention Procedures', 150.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('96360-96549','Hydration, Therapeutic, Prophylactic, Diagnostic Injections and Infusions, and Chemotherapy and Other Highly Complex Drug or Highly Complex Biologic Agent Administration', 1375.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('96567-96574','Photodynamic Therapy Procedures', 850.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('96900-96999','Special Dermatological Procedures', 750.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('97010-97799','Physical Medicine and Rehabilitation Evaluations', 225.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('97151-97158','Adaptive Behavior Services', 325.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('97802-97804','Medical Nutrition Therapy Procedures', 425.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('97810-97814','Acupuncture Procedures', 600.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('98925-98929','Osteopathic Manipulative Treatment Procedures', 900.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('98940-98943','Chiropractic Manipulative Treatment Procedures', 710.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('98960-98962','Education and Training for Patient Self-Management', 230.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('98966-98972','Non-Face-to-Face Nonphysician Services', 300.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('99000-99091','Special Services, Procedures and Reports', 1250.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('99100-99140','Qualifying Circumstances for Anesthesia', 100.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('99151-99157','Moderate (Conscious) Sedation', 350.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('99170-99199','Other Medicine Services and Procedures', 500.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('99500-99602','Home Health Procedures and Services', 1000.0);
INSERT INTO medical_procedure (procedure_id, name, price) VALUES ('99605-99607','Medication Therapy Management Services', 550.0);
DROP TABLE IF EXISTS medical_procedure;

CREATE TABLE medical_procedure(
    procedure_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256)
);

INSERT INTO medical_procedure (procedure_id, name) VALUES ('90281-90399', 'Immune Globulins, Serum or Recombinant Products');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('90460-0031A','Immunization Administration for Vaccines/Toxoids');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('90476-90756','Vaccines, Toxoids');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('90785-90899','Psychiatry Services and Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('90901-90913','Biofeedback Services and Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('90935-90999','Dialysis Services and Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('91010-91299','Gastroenterology Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('91300-91303','COVID-19 Vaccines/Toxoids');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('92002-92499','Ophthalmology Services and Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('92502-92700','Special Otorhinolaryngologic Services and Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('92920-93799','Cardiovascular Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('93880-93998','Non-Invasive Vascular Diagnostic Studies');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('94002-94799','Pulmonary Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('95004-95199','Allergy and Clinical Immunology Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('95249-95251','Endocrinology Services');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('95700-96020','Neurology and Neuromuscular Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('96040-96040','Medical Genetics and Genetic Counseling Services');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('96105-96146','Central Nervous System Assessments/Tests (eg, Neuro-Cognitive, Mental Status, Speech Testing)');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('96156-96171','Health Behavior Assessment and Intervention Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('96360-96549','Hydration, Therapeutic, Prophylactic, Diagnostic Injections and Infusions, and Chemotherapy and Other Highly Complex Drug or Highly Complex Biologic Agent Administration');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('96567-96574','Photodynamic Therapy Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('96900-96999','Special Dermatological Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('97010-97799','Physical Medicine and Rehabilitation Evaluations');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('97151-97158','Adaptive Behavior Services');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('97802-97804','Medical Nutrition Therapy Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('97810-97814','Acupuncture Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('98925-98929','Osteopathic Manipulative Treatment Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('98940-98943','Chiropractic Manipulative Treatment Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('98960-98962','Education and Training for Patient Self-Management');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('98966-98972','Non-Face-to-Face Nonphysician Services');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('99000-99091','Special Services, Procedures and Reports');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('99100-99140','Qualifying Circumstances for Anesthesia');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('99151-99157','Moderate (Conscious) Sedation');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('99170-99199','Other Medicine Services and Procedures');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('99500-99602','Home Health Procedures and Services');
INSERT INTO medical_procedure (procedure_id, name) VALUES ('99605-99607','Medication Therapy Management Services');
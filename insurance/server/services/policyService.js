const sequelize = require('../db');

async function getAllPolicies(cb) {
    let result = await sequelize.query(
        'SELECT * FROM policy;',
        {
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    cb(result);
}
module.exports.getAllPolicies = getAllPolicies;

async function getDrugsFromPolicyId(policy_id, cb) {
    let result = await sequelize.query(
        'SELECT * FROM policy_drug JOIN drug ON policy_drug.drug_id=drug.drug_id WHERE policy_id=? ORDER BY drug_name;',
        {
            replacements: [
                policy_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    cb(result);
}
module.exports.getDrugsFromPolicyId = getDrugsFromPolicyId;

async function getAllDrugs(cb) {
    let result = await sequelize.query(
        'SELECT * FROM drug;',
        {
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    cb(result);
}
module.exports.getAllDrugs = getAllDrugs;

async function getProceduresFromPolicyId(policy_id, cb) {
    let result = await sequelize.query(
        'SELECT * FROM policy_procedure JOIN `procedure` ON policy_procedure.procedure_id=`procedure`.procedure_id WHERE policy_id=? ORDER BY procedure_name;',
        {
            replacements: [
                policy_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    cb(result);
}
module.exports.getProceduresFromPolicyId = getProceduresFromPolicyId;

async function getAllProcedures(cb) {
    let result = await sequelize.query(
        'SELECT * FROM `procedure`;',
        {
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    cb(result);
}
module.exports.getAllProcedures = getAllProcedures;

async function createPolicy(policy, cb) {

    let queryRes = await sequelize.query(
        'INSERT INTO policy (code, policy_name, age_limit, max_coverage_per_year, percent_coverage, premium_per_month, policy_status) VALUES (?, ?, ?, ?, ?, ?, ?);',
        {
            replacements: [
                policy.code,
                policy.policy_name,
                policy.age_limit,
                policy.max_coverage_per_year,
                policy.percent_coverage,
                policy.premium_per_month,
                policy.policy_status
            ],
            type: sequelize.QueryTypes.INSERT,
            returning: true
        }
    ).catch(function (e) {
        // error handling
        console.log('sql error (policy):');
        if (e.errors != null) {
            console.log('some error');
            return 'The code must be unique';
        } else {
            console.log('unknown error');
            console.log(e);
            return 'Unknown error';
        }
    });
    if (typeof queryRes === 'string' || queryRes instanceof String) {
        cb(queryRes);
        return;
    }

    let policyId = queryRes[0];

    for (let i = 0; i < policy.selectedDrugIds.length; i++) {
        queryRes = await sequelize.query(
            'INSERT INTO policy_drug (policy_id, drug_id) VALUES (?, ?);',
            {
                replacements: [
                    policyId,
                    policy.selectedDrugIds[i]
                ],
                type: sequelize.QueryTypes.INSERT,
                returning: true
            }
        ).catch(function (e) {
            // error handling
            console.log('sql error (policy_drug):');
            if (e.errors != null) {
                console.log('some error');
                return 'Database error';
            } else {
                console.log('unknown error');
                return 'Unknown error';
            }
        });
        if (typeof queryRes === 'string' || queryRes instanceof String) {
            cb(queryRes);
            return;
        }
    }
    // procedures
    for (let i = 0; i < policy.selectedProcedureIds.length; i++) {
        queryRes = await sequelize.query(
            'INSERT INTO policy_procedure (policy_id, procedure_id) VALUES (?, ?);',
            {
                replacements: [
                    policyId,
                    policy.selectedProcedureIds[i]
                ],
                type: sequelize.QueryTypes.INSERT,
                returning: true
            }
        ).catch(function (e) {
            // error handling
            console.log('sql error (policy_drug):');
            if (e.errors != null) {
                console.log('some error');
                return 'Database error';
            } else {
                console.log('unknown error');
                return 'Unknown error';
            }
        });
        if (typeof queryRes === 'string' || queryRes instanceof String) {
            cb(queryRes);
            return;
        }
    }

    cb(null);
}

module.exports.createPolicy = createPolicy;

async function updatePolicy(policy, cb) {

    let queryRes = await sequelize.query(
        'UPDATE policy SET code=?, policy_name=?, age_limit=?, max_coverage_per_year=?, percent_coverage=?, premium_per_month=?, policy_status=? WHERE policy_id=?;',
        {
            replacements: [
                policy.code,
                policy.policy_name,
                policy.age_limit,
                policy.max_coverage_per_year,
                policy.percent_coverage,
                policy.premium_per_month,
                policy.policy_status,
                policy.policy_id
            ],
            type: sequelize.QueryTypes.UPDATE,
            returning: true
        }
    ).catch(function (e) {
        // error handling
        console.log('sql error (update policy):');
        console.log(e);
        return 'Database error';
        
    });
    if (typeof queryRes === 'string' || queryRes instanceof String) {
        cb(queryRes);
        return;
    }

    // delete rows
    queryRes = await sequelize.query(
        'DELETE FROM policy_drug WHERE policy_id=?',
        {
            replacements: [
                policy.policy_id
            ],
            type: sequelize.QueryTypes.DELETE,
            returning: true
        }
    ).catch(function (e) {
        // error handling
        console.log('sql error (delete policy_drug):');
        console.log(e);
        return 'Database error';
    });
    if (typeof queryRes === 'string' || queryRes instanceof String) {
        err = queryRes;
    }

    for (let i = 0; i < policy.selectedDrugIds.length; i++) {
        queryRes = await sequelize.query(
            'INSERT INTO policy_drug (policy_id, drug_id) VALUES (?, ?);',
            {
                replacements: [
                    policy.policy_id,
                    policy.selectedDrugIds[i]
                ],
                type: sequelize.QueryTypes.INSERT,
                returning: true
            }
        ).catch(function (e) {
            // error handling
            console.log('sql error insert (policy_drug):');
            if (e.errors != null) {
                console.log('some error');
                return 'The code must be unique';
            } else {
                console.log('unknown error');
                return 'Unknown error';
            }
        });
        if (typeof queryRes === 'string' || queryRes instanceof String) {
            cb(queryRes);
            return;
        }
    }

    // procedure
    // delete rows
    queryRes = await sequelize.query(
        'DELETE FROM policy_procedure WHERE policy_id=?',
        {
            replacements: [
                policy.policy_id
            ],
            type: sequelize.QueryTypes.DELETE,
            returning: true
        }
    ).catch(function (e) {
        // error handling
        console.log('sql error (delete policy_procedure):');
        console.log(e);
        return 'Database error';
    });
    if (typeof queryRes === 'string' || queryRes instanceof String) {
        err = queryRes;
    }

    for (let i = 0; i < policy.selectedProcedureIds.length; i++) {
        queryRes = await sequelize.query(
            'INSERT INTO policy_procedure (policy_id, procedure_id) VALUES (?, ?);',
            {
                replacements: [
                    policy.policy_id,
                    policy.selectedProcedureIds[i]
                ],
                type: sequelize.QueryTypes.INSERT,
                returning: true
            }
        ).catch(function (e) {
            // error handling
            console.log('sql error insert (policy_procedure):');
            if (e.errors != null) {
                console.log('some error');
                return 'Database error';
            } else {
                console.log('unknown error');
                return 'Unknown error';
            }
        });
        if (typeof queryRes === 'string' || queryRes instanceof String) {
            cb(queryRes);
            return;
        }
    }
    cb(null);
}

module.exports.updatePolicy = updatePolicy;

async function getPolicyHoldersWithPolicy(policy, cb) {
    let result = await sequelize.query(
        'SELECT * FROM policy_holder WHERE policy_id=?;',
        {
            replacements: [
                policy.policy_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    cb(result);
}

module.exports.getPolicyHoldersWithPolicy = getPolicyHoldersWithPolicy;

async function getPolicyByPatient(payload, cb) {
    console.log('PAYLOAD');
    console.log(payload);
    let returnPayload = {policy: null, procedures: null};

    let patient = payload.patient;
    let resultPolicy = await sequelize.query(
        'SELECT * FROM policy JOIN policy_holder ON policy.policy_id = policy_holder.policy_id WHERE first_name=? AND last_name=? AND date_of_birth=? AND address=?;',
        {
            replacements: [
                patient.first_name,
                patient.last_name,
                patient.date_of_birth,
                patient.address,
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    if (resultPolicy.length > 0) {
        resultPolicy = resultPolicy[0];
        returnPayload.policy = resultPolicy;
        let resultProcedure = await sequelize.query(
            'SELECT * FROM `procedure` JOIN policy_procedure ON `procedure`.procedure_id = policy_procedure.procedure_id WHERE policy_id=?;',
            {
                replacements: [
                    resultPolicy.policy_id
                ],
                type: sequelize.QueryTypes.SELECT
            }
        ).catch(function(e){
            console.log('SQL Error:');
            console.log(e);
            return null;
        });

        for (let i = 0; i < payload.procedures.length; i++) {
            let procedure = payload.procedures[i];
            // check to see if procedure of payload is covered
            let coveredProcedures = resultProcedure;
            for (let j = 0; j < coveredProcedures.length; j++) {
                if (procedure.procedure_id == coveredProcedures[i].procedure_id_hc) {
                    // make a request
                    let patient = payload.patient;
                    let queryRes = await sequelize.query(
                        'INSERT INTO request_hc (request_hc_status, request_hc_date, first_name, last_name, address, date_of_birth, amount, other_id, procedure_id) VALUES (2, CURDATE(), ?, ?, ?, ?, ?, ?, (SELECT procedure_id FROM `procedure` WHERE procedure_id_hc=?));',
                        {
                            replacements: [
                                patient.first_name,
                                patient.last_name,
                                patient.address,
                                (new Date(patient.date_of_birth)).toISOString().slice(0, 19).replace('T', ' '),
                                procedure.price,
                                payload.visitation_id,
                                procedure.procedure_id
                            ],
                            type: sequelize.QueryTypes.INSERT,
                            returning: true
                        }
                    ).catch(function (e) {
                        // error handling
                        console.log('sql error insert (policy_drug):');
                        if (e.errors != null) {
                            console.log('Database error');
                            return 'Database error';
                        } else {
                            console.log('unknown error');
                            console.log(e);
                            return 'Unknown error';
                        }
                    });
    


                    break;
                }
            }
        }

        returnPayload.procedures = resultProcedure;
    }
    cb(returnPayload);    
}

module.exports.getPolicyByPatient = getPolicyByPatient;

async function getPolicyByPatientPharmacy(payload, cb) {
    let returnPayload = {policy: null, medicines: null, covered_medicine: false};

    let prescription = payload.prescription;
    let resultPolicy = await sequelize.query(
        'SELECT * FROM policy JOIN policy_holder ON policy.policy_id = policy_holder.policy_id WHERE first_name=? AND last_name=? AND date_of_birth=? AND address=?;',
        {
            replacements: [
                prescription.patient_first_name,
                prescription.patient_last_name,
                prescription.patient_date_of_birth,
                prescription.patient_address,
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    
    if (resultPolicy.length > 0) {
        resultPolicy = resultPolicy[0];
        returnPayload.policy = resultPolicy;
        let resultMedicine= await sequelize.query(
            'SELECT * FROM drug JOIN policy_drug ON drug.drug_id = policy_drug.drug_id WHERE policy_id=?;',
            {
                replacements: [
                    resultPolicy.policy_id
                ],
                type: sequelize.QueryTypes.SELECT
            }
        ).catch(function(e){
            console.log('SQL Error:');
            console.log(e);
            return null;
        });
        returnPayload.medicines = resultMedicine;

        for (let i = 0; i < returnPayload.medicines.length; i++) {
            if (returnPayload.medicines[i].drug_code == payload.medicine.medicine_code) {
                returnPayload.covered_medicine = true;
                // create drug request
                queryRes = await sequelize.query(
                    'INSERT INTO request (request_status, request_date, first_name, last_name, address, date_of_birth, amount, other_id, drug_id) VALUES (2, CURDATE(), ?, ?, ?, ?, ?, ?, (SELECT drug_id FROM drug WHERE drug_code=?));',
                    {
                        replacements: [
                            prescription.patient_first_name,
                            prescription.patient_last_name,
                            prescription.patient_address,
                            (new Date(prescription.patient_date_of_birth)).toISOString().slice(0, 19).replace('T', ' '),
                            payload.medicine.cost,
                            prescription.prescription_id,
                            payload.medicine.medicine_code
                        ],
                        type: sequelize.QueryTypes.INSERT,
                        returning: true
                    }
                ).catch(function (e) {
                    // error handling
                    console.log('sql error insert (policy_drug):');
                    if (e.errors != null) {
                        console.log('some error');
                        return 'The code must be unique';
                    } else {
                        console.log('unknown error');
                        return 'Unknown error';
                    }
                });
                break;
            }
        }
    }
    cb(returnPayload);    
}

module.exports.getPolicyByPatientPharmacy = getPolicyByPatientPharmacy;
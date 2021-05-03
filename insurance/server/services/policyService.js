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
    let today = new Date();
    payload.request_date = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    console.log('PAYLOAD');
    console.log(payload);

    // Get the policy and policy holder
    let resultPolicy = await sequelize.query(
        'SELECT * FROM policy JOIN policy_holder ON policy.policy_id = policy_holder.policy_id WHERE first_name=? AND last_name=? AND date_of_birth=? AND address=? AND start_date <= CONVERT(?, DATE) AND CONVERT(?, DATE) <= end_date;',
        {
            replacements: [
                payload.patient_first,
                payload.patient_last,
                payload.date_of_birth,
                payload.address,
                payload.request_date,
                payload.request_date
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    
    if (resultPolicy.length > 0) {
        // A policy and policy holder has been found
        resultPolicy = resultPolicy[0];
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

        // For each procedure in the payload
        for (let i = 0; i < payload.procedures.length; i++) {
            let procedure = payload.procedures[i];

            // check to see if procedure of payload is covered
            let coveredProcedures = resultProcedure;

            // For each covered procedure
            let flag = false;
            for (let j = 0; j < coveredProcedures.length; j++) {

                if (procedure.procedure_id == coveredProcedures[j].procedure_id_hc) {
                    // If the procedure's ID is equal to the covered procedure...
                    // make a request
                    payload['procedure'] = procedure;
                    console.log('Make a 2 request');
                    flag = true;
                    let patient = payload.patient;
                    let queryRes = await sequelize.query(
                        'INSERT INTO request_hc (request_hc_status, request_hc_date, first_name, last_name, address, date_of_birth, amount, other_id, procedure_id, payload) VALUES (2, CURDATE(), ?, ?, ?, ?, ?, ?, (SELECT procedure_id FROM `procedure` WHERE procedure_id_hc=?), ?);',
                        {
                            replacements: [
                                payload.patient_first,
                                payload.patient_last,
                                payload.address,
                                (new Date(payload.date_of_birth)).toISOString().slice(0, 19).replace('T', ' '),
                                procedure.price,
                                payload.visitation_id,
                                procedure.procedure_id,
                                JSON.stringify(payload)
                            ],
                            type: sequelize.QueryTypes.INSERT,
                            returning: true
                        }
                    ).catch(function (e) {
                        // error handling
                        console.log('sql error insert (request 2):');
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

            // Check to see if procedure was covered
            if (flag) {
                // procedure is covered and a request was sent
            } else {
                // procedure is NOT covered. Send a request to DENY
                console.log('Make a 4 request');
                payload['procedure'] = procedure;
                let queryRes = await sequelize.query(
                    'INSERT INTO request_hc (request_hc_status, request_hc_date, first_name, last_name, address, date_of_birth, amount, other_id, procedure_id, payload) VALUES (4, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?);',
                    {
                        replacements: [
                            payload.patient_first,
                            payload.patient_last,
                            payload.address,
                            (new Date(payload.date_of_birth)).toISOString().slice(0, 19).replace('T', ' '),
                            procedure.price,
                            payload.visitation_id,
                            null,
                            JSON.stringify(payload)
                        ],
                        type: sequelize.QueryTypes.INSERT,
                        returning: true
                    }
                ).catch(function (e) {
                    // error handling
                    console.log('sql error insert (request 3):');
                    if (e.errors != null) {
                        console.log('Database error');
                        return 'Database error';
                    } else {
                        console.log('unknown error');
                        console.log(e);
                        return 'Unknown error';
                    }
                });
            }
        }

    } else {
        // No policy holder
        console.log('Make a 3 request');
        for (let i = 0; i < payload.procedures.length; i++) {
            let procedure = payload.procedures[i];
            payload['procedure'] = procedure;
            let queryRes = await sequelize.query(
                'INSERT INTO request_hc (request_hc_status, request_hc_date, first_name, last_name, address, date_of_birth, amount, other_id, procedure_id, payload) VALUES (3, CURDATE(), ?, ?, ?, ?, ?, ?, (SELECT procedure_id FROM `procedure` WHERE procedure_id_hc=? LIMIT 1), ?);',
                {
                    replacements: [
                        payload.patient_first,
                        payload.patient_last,
                        payload.address,
                        (new Date(payload.date_of_birth)).toISOString().slice(0, 19).replace('T', ' '),
                        procedure.price,
                        payload.visitation_id,
                        procedure.procedure_id,
                        JSON.stringify(payload)
                    ],
                    type: sequelize.QueryTypes.INSERT,
                    returning: true
                }
            ).catch(function (e) {
                // error handling
                console.log('sql error insert (request 3):');
                if (e.errors != null) {
                    console.log('Database error');
                    return 'Database error';
                } else {
                    console.log('unknown error');
                    console.log(e);
                    return 'Unknown error';
                }
            });
        }
        
    }
    cb('200');    
}
/*
{ visitation_id: 18,
  physician_id: 8,
  patient_id: 11,
  visitation_date: 2021-04-18T22: 30: 37.000Z,
  status: 2,
  patient_first: 'Bobby',
  patient_last: 'Fisher',
  physician_first: 'Meg',
  physician_last: 'White',
  address: '123 Street',
  date_of_birth: 1980-01-01,
  physician_state: 'MI',
  license_number: '152352',
  procedures: [
        { visitation_id: 30,
       procedure_id: '90785-90899',
       insurance_pays: null,
       name: 'Psychiatry Services and Procedures',
       price: 350
        },
        { visitation_id: 30,
       procedure_id: '92920-93799',
       insurance_pays: null,
       name: 'Cardiovascular Procedures',
       price: 450
        }
    ]
}
*/

module.exports.getPolicyByPatient = getPolicyByPatient;

async function getPolicyByPatientUpdate(payload, cb) {
    // Get the policy and policy holder
    let resultPolicy = await sequelize.query(
        'SELECT * FROM policy JOIN policy_holder ON policy.policy_id = policy_holder.policy_id WHERE first_name=? AND last_name=? AND date_of_birth=? AND address=? AND start_date <= CONVERT(?, DATE) AND CONVERT(?, DATE) <= end_date;',
        {
            replacements: [
                payload.patient_first,
                payload.patient_last,
                payload.date_of_birth,
                payload.address,
                payload.request_date,
                payload.request_date
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    
    if (resultPolicy.length > 0) {
        // A policy and policy holder has been found
        resultPolicy = resultPolicy[0];
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

        // For each procedure in the payload
        for (let i = 0; i < payload.procedures.length; i++) {
            let procedure = payload.procedures[i];

            // check to see if procedure of payload is covered
            let coveredProcedures = resultProcedure;

            // For each covered procedure
            let flag = false;
            for (let j = 0; j < coveredProcedures.length; j++) {

                if (procedure.procedure_id == coveredProcedures[j].procedure_id_hc) {
                    // If the procedure's ID is equal to the covered procedure...
                    // make a request
                    payload['procedure'] = procedure;
                    console.log('Make a 2 request');
                    flag = true;
                    let patient = payload.patient;
                    let queryRes = await sequelize.query(
                        'UPDATE request_hc SET request_hc_status = 2 WHERE request_hc_id = ?;',
                        {
                            replacements: [
                                payload.request_hc_id
                            ],
                            type: sequelize.QueryTypes.INSERT,
                            returning: true
                        }
                    ).catch(function (e) {
                        // error handling
                        console.log('sql error insert (request 2):');
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

            // Check to see if procedure was covered
            if (flag) {
                // procedure is covered and a request was sent
            } else {
                // procedure is NOT covered. Send a request to DENY
                console.log('Make a 4 request');
                payload['procedure'] = procedure;
                let queryRes = await sequelize.query(
                    'UPDATE request_hc SET request_hc_status = 4 WHERE request_hc_id = ?;',
                    {
                        replacements: [
                            payload.request_hc_id
                        ],
                        type: sequelize.QueryTypes.INSERT,
                        returning: true
                    }
                ).catch(function (e) {
                    // error handling
                    console.log('sql error insert (request 3):');
                    if (e.errors != null) {
                        console.log('Database error');
                        return 'Database error';
                    } else {
                        console.log('unknown error');
                        console.log(e);
                        return 'Unknown error';
                    }
                });
            }
        }

    } else {
        // No policy holder
        console.log('Make a 3 request');
        for (let i = 0; i < payload.procedures.length; i++) {
            let procedure = payload.procedures[i];
            payload['procedure'] = procedure;
            let queryRes = await sequelize.query(
                'UPDATE request_hc SET request_hc_status = 3 WHERE request_hc_id = ?;',
                {
                    replacements: [
                        payload.request_hc_id
                    ],
                    type: sequelize.QueryTypes.INSERT,
                    returning: true
                }
            ).catch(function (e) {
                // error handling
                console.log('sql error insert (request 3):');
                if (e.errors != null) {
                    console.log('Database error');
                    return 'Database error';
                } else {
                    console.log('unknown error');
                    console.log(e);
                    return 'Unknown error';
                }
            });
        }
        
    }
    cb('200');    
}

module.exports.getPolicyByPatientUpdate = getPolicyByPatientUpdate;

async function getPolicyByPatientPharmacy(payload, cb) {
    let today = new Date();

    payload.request_date = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    console.log('payload');
    console.log(payload);
    let prescription = payload.prescription;

    // Get the policy holder and policy
    let resultPolicy = await sequelize.query(
        'SELECT * FROM policy JOIN policy_holder ON policy.policy_id = policy_holder.policy_id WHERE first_name=? AND last_name=? AND date_of_birth=? AND address=? AND start_date <= CONVERT(?, DATE) AND CONVERT(?, DATE) <= end_date;',
        {
            replacements: [
                prescription.patient_first_name,
                prescription.patient_last_name,
                prescription.patient_date_of_birth,
                prescription.patient_address,
                payload.request_date,
                payload.request_date
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    
    if (resultPolicy.length > 0) {
        // A policy and policy holder has been found
        resultPolicy = resultPolicy[0];
        let resultMedicine = await sequelize.query(
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

        // for each drug in the policy
        let flag = false;
        for (let i = 0; i < resultMedicine.length; i++) {
            if (resultMedicine[i].drug_code == payload.medicine.medicine_code) {
                console.log('Make a 2 request');
                flag = true;
                // create drug request
                queryRes = await sequelize.query(
                    'INSERT INTO request (request_status, request_date, first_name, last_name, address, date_of_birth, amount, other_id, drug_id, payload) VALUES (2, CURDATE(), ?, ?, ?, ?, ?, ?, (SELECT drug_id FROM drug WHERE drug_code=?), ?);',
                    {
                        replacements: [
                            prescription.patient_first_name,
                            prescription.patient_last_name,
                            prescription.patient_address,
                            (new Date(prescription.patient_date_of_birth)).toISOString().slice(0, 19).replace('T', ' '),
                            (payload.prescription.quantity * payload.medicine.cost),
                            prescription.prescription_id,
                            payload.medicine.medicine_code,
                            JSON.stringify(payload)
                        ],
                        type: sequelize.QueryTypes.INSERT,
                        returning: true
                    }
                ).catch(function (e) {
                    // error handling
                    console.log('sql error insert (policy_drug):');
                    if (e.errors != null) {
                        console.log('some error');
                    } else {
                        console.log('unknown error');
                    }
                    console.log(e);
                    return null;
                });
                break;
            }
        }

        if (flag) {
            // drug is covered and request already made
        } else {
            // drug is NOT covered
            console.log('Make a 4 request');
            queryRes = await sequelize.query(
                'INSERT INTO request (request_status, request_date, first_name, last_name, address, date_of_birth, amount, other_id, drug_id, payload) VALUES (4, CURDATE(), ?, ?, ?, ?, ?, ?, (SELECT drug_id FROM drug WHERE drug_code=?), ?);',
                {
                    replacements: [
                        prescription.patient_first_name,
                        prescription.patient_last_name,
                        prescription.patient_address,
                        (new Date(prescription.patient_date_of_birth)).toISOString().slice(0, 19).replace('T', ' '),
                        (payload.prescription.quantity * payload.medicine.cost),
                        prescription.prescription_id,
                        payload.medicine.medicine_code,
                        JSON.stringify(payload)
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
        }
    } else {
        console.log('Make a 3 request');
        queryRes = await sequelize.query(
            'INSERT INTO request (request_status, request_date, first_name, last_name, address, date_of_birth, amount, other_id, drug_id, payload) VALUES (3, CURDATE(), ?, ?, ?, ?, ?, ?, (SELECT drug_id FROM drug WHERE drug_code=?), ?);',
            {
                replacements: [
                    prescription.patient_first_name,
                    prescription.patient_last_name,
                    prescription.patient_address,
                    (new Date(prescription.patient_date_of_birth)).toISOString().slice(0, 19).replace('T', ' '),
                    (payload.prescription.quantity * payload.medicine.cost),
                    prescription.prescription_id,
                    payload.medicine.medicine_code,
                    JSON.stringify(payload)
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
    }
    cb('200');    
}

module.exports.getPolicyByPatientPharmacy = getPolicyByPatientPharmacy;

async function getPolicyByPatientPharmacyUpdate(payload, cb) {
    console.log('payload');
    console.log(payload);
    let prescription = payload.prescription;

    // Get the policy holder and policy
    let resultPolicy = await sequelize.query(
        'SELECT * FROM policy JOIN policy_holder ON policy.policy_id = policy_holder.policy_id WHERE first_name=? AND last_name=? AND date_of_birth=? AND address=? AND start_date <= CONVERT(?, DATE) AND CONVERT(?, DATE) <= end_date;',
        {
            replacements: [
                prescription.patient_first_name,
                prescription.patient_last_name,
                prescription.patient_date_of_birth,
                prescription.patient_address,
                payload.request_date,
                payload.request_date
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    
    if (resultPolicy.length > 0) {
        // A policy and policy holder has been found
        resultPolicy = resultPolicy[0];
        let resultMedicine = await sequelize.query(
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

        // for each drug in the policy
        let flag = false;
        for (let i = 0; i < resultMedicine.length; i++) {
            if (resultMedicine[i].drug_code == payload.medicine.medicine_code) {
                console.log('Make a 2 request');
                flag = true;
                // create drug request
                queryRes = await sequelize.query(
                    'UPDATE request SET request_status = 2, drug_id = (SELECT drug_id FROM drug WHERE drug_code=?) WHERE request_id = ?;',
                    {
                        replacements: [
                            payload.medicine.medicine_code,
                            payload.request_id
                        ],
                        type: sequelize.QueryTypes.INSERT,
                        returning: true
                    }
                ).catch(function (e) {
                    // error handling
                    console.log('sql error insert (policy_drug):');
                    if (e.errors != null) {
                        console.log('some error');
                    } else {
                        console.log('unknown error');
                    }
                    console.log(e);
                    return null;
                });
                break;
            }
        }

        if (flag) {
            // drug is covered and request already made
        } else {
            // drug is NOT covered
            console.log('Make a 4 request');
            queryRes = await sequelize.query(
                'UPDATE request SET request_status = 4 WHERE request_id = ?;',
                {
                    replacements: [
                        payload.request_id
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
        }
    } else {
        console.log('Make a 3 request');
        queryRes = await sequelize.query(
            'UPDATE request SET request_status = 3 WHERE request_id = ?;',
            {
                replacements: [
                    payload.request_id
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
    }
    cb('200');    
}

module.exports.getPolicyByPatientPharmacyUpdate = getPolicyByPatientPharmacyUpdate;

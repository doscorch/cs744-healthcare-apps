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

async function createPolicy(policy, cb) {

    let queryRes = await sequelize.query(
        'INSERT INTO policy (code, policy_name, age_limit, max_coverage_per_year, percent_coverage, premium_per_month) VALUES (?, ?, ?, ?, ?, ?);',
        {
            replacements: [
                policy.code,
                policy.policy_name,
                policy.age_limit,
                policy.max_coverage_per_year,
                policy.percent_coverage,
                policy.premium_per_month
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

    cb(null);
}

module.exports.createPolicy = createPolicy;

async function updatePolicy(policy, cb) {

    let queryRes = await sequelize.query(
        'UPDATE policy SET code=?, policy_name=?, age_limit=?, max_coverage_per_year=?, percent_coverage=?, premium_per_month=? WHERE policy_id=?;',
        {
            replacements: [
                policy.code,
                policy.policy_name,
                policy.age_limit,
                policy.max_coverage_per_year,
                policy.percent_coverage,
                policy.premium_per_month,
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

    cb(null);
}

module.exports.updatePolicy = updatePolicy;

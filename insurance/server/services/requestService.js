const sequelize = require('../db');
const fetch = require("node-fetch");

async function getAllRequests(cb) {
    let result = await sequelize.query(
        'SELECT * FROM request ORDER BY request_status DESC;',
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
module.exports.getAllRequests = getAllRequests;

async function getAllRequestsHC(cb) {
    let result = await sequelize.query(
        'SELECT * FROM request_hc ORDER BY request_hc_status DESC, other_id;',
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
module.exports.getAllRequestsHC = getAllRequestsHC;

async function getProcedure(procedure_id, cb) {
    let result = await sequelize.query(
        'SELECT * FROM `procedure` WHERE procedure_id=?;',
        {
            replacements: [
                procedure_id
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
module.exports.getProcedure = getProcedure;

async function getDrug(drug_id, cb) {
    let result = await sequelize.query(
        'SELECT * FROM drug WHERE drug_id=?;',
        {
            replacements: [
                drug_id
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
module.exports.getDrug = getDrug;


const pharmacyURL = 'http://localhost:5001'; //CHANGE ME
const pharmacyPath = '/insurance/receive/policy';
async function requestAction(request, cb) {
    console.log('REQUEST');
    console.log(request);
    let result = await sequelize.query(
        'UPDATE request SET request_status=? WHERE request_id=?',
        {
            replacements: [
                request.request_status,
                request.request_id,
            ],
            type: sequelize.QueryTypes.UPDATE
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    // Create transaction IF approved

    if (request.request_status == 1) {
        result = await sequelize.query(
            'INSERT INTO transaction (transaction_date, request_id, policy_holder_id, amount) VALUES (CURDATE(), ?, ?, ?)',
            {
                replacements: [
                    request.request_id,
                    request.policy_holder.policy_holder_id,
                    request.covered
                ],
                type: sequelize.QueryTypes.INSERT
            }
        ).catch(function(e){
            console.log('SQL Error:');
            console.log(e);
            return null;
        });
        // update policy holder with amount paid and remaining
        result = await sequelize.query(
            'UPDATE policy_holder SET amount_paid=?, amount_remaining=? WHERE policy_holder_id=?;',
            {
                replacements: [
                    request.paid,
                    request.remaining,
                    request.policy_holder.policy_holder_id,
                ],
                type: sequelize.QueryTypes.UPDATE
            }
        ).catch(function(e){
            console.log('SQL Error (update policy holder):');
            console.log(e);
            return null;
        });    
    } else {
        // IF NOT APPROVED

        let ph_id = null;
        if (request.policy_holder != null) {
            ph_id = request.policy_holder.policy_holder_id;
        }
        result = await sequelize.query(
            'INSERT INTO transaction (transaction_date, request_id, policy_holder_id, amount) VALUES (CURDATE(), ?, ?, 0)',
            {
                replacements: [
                    request.request_id,
                    ph_id
                ],
                type: sequelize.QueryTypes.INSERT
            }
        ).catch(function(e){
            console.log('SQL Error:');
            console.log(e);
            return null;
        });
    }

    
    request.is_approved = request.request_status == 1;
    request.reason = null;
    request.insurance_pays = request.covered;

    if (!request.is_approved) {
        request.insurance_pays = 0;
        if (request.request_status == 5) {
            request.reason = 'Not insured';
        } else if (request.request_status == 6) {
            request.reason = 'No coverage';
        } else {
            request.reason = 'Other';
        }
    }

    let pc = null;
    if (request.policy != null) {
        pc = request.policy.percent_coverage;
    }
    
    let payload = {
        prescription_id: request.other_id,
        percent_coverage: pc,
        drug: request,
      }

    fetch(`${pharmacyURL}${pharmacyPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    console.log('PAYLOAD');
    console.log(payload);
    console.log(JSON.stringify(payload));
    cb(payload);
}
module.exports.requestAction = requestAction;



const healthcareURL = 'http://localhost:5000'; //CHANGE ME
const healthcarePath = '/insurance/visitation/response';
async function requestActionHC(request, cb) {
    console.log('HC REQUEST');
    console.log(request);
    let result = await sequelize.query(
        'UPDATE request_hc SET request_hc_status=? WHERE request_hc_id=?',
        {
            replacements: [
                request.request_hc_status,
                request.request_hc_id,
            ],
            type: sequelize.QueryTypes.UPDATE
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    // Create transaction IF approved

    if (request.request_hc_status == 1) {
        result = await sequelize.query(
            'INSERT INTO transaction_hc (transaction_hc_date, request_hc_id, policy_holder_id, amount) VALUES (CURDATE(), ?, ?, ?)',
            {
                replacements: [
                    request.request_hc_id,
                    request.policy_holder.policy_holder_id,
                    request.covered
                ],
                type: sequelize.QueryTypes.INSERT
            }
        ).catch(function(e){
            console.log('SQL Error:');
            console.log(e);
            return null;
        });
        // update policy holder with amount paid and remaining
        result = await sequelize.query(
            'UPDATE policy_holder SET amount_paid=?, amount_remaining=? WHERE policy_holder_id=?;',
            {
                replacements: [
                    request.paid,
                    request.remaining,
                    request.policy_holder.policy_holder_id,
                ],
                type: sequelize.QueryTypes.UPDATE
            }
        ).catch(function(e){
            console.log('SQL Error (update policy holder):');
            console.log(e);
            return null;
        });    
    } else {
        let ph_id = null;

        if (request.policy_holder != null) {
            ph_id = policy_holder_id;
        }
        result = await sequelize.query(
            'INSERT INTO transaction_hc (transaction_hc_date, request_hc_id, policy_holder_id, amount) VALUES (CURDATE(), ?, ?, 0)',
            {
                replacements: [
                    request.request_hc_id,
                    ph_id
                ],
                type: sequelize.QueryTypes.INSERT
            }
        ).catch(function(e){
            console.log('SQL Error:');
            console.log(e);
            return null;
        });
    }
    

    // check to see if for all other requests of the same visitation id, are NOT pending

    let count = await sequelize.query(
        'SELECT COUNT(*) FROM request_hc WHERE other_id=? AND (request_hc_status = 2 OR request_hc_status = 3 OR request_hc_status = 4);',
        {
            replacements: [
                request.other_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    if (count[0]['COUNT(*)'] == 0) {
        // send the payload

        // get all requests and procedures
        let r = await sequelize.query(
            'SELECT * FROM request_hc JOIN `procedure` ON request_hc.procedure_id=`procedure`.procedure_id JOIN transaction_hc ON transaction_hc.request_hc_id = request_hc.request_hc_id WHERE other_id=?;',
            {
                replacements: [
                    request.other_id
                ],
                type: sequelize.QueryTypes.SELECT
            }
        ).catch(function(e){
            console.log('SQL Error:');
            console.log(e);
            return null;
        });
        console.log('r');
        console.log(r);

        for (let i = 0; i < r.length; i++) {
            r[i].is_approved = r[i].request_hc_status == 1;
            r[i].reason = null;
            r[i].insurance_pays = r[i].amount;

            if (!r[i].is_approved) {
                r[i].insurance_pays = 0;
                if (r[i].request_hc_status == 5) {
                    r[i].reason = 'Not insured';
                } else if (r[i].request_hc_status == 6) {
                    r[i].reason = 'No coverage';
                } else {
                    r[i].reason = 'Other';
                }
            }
        }

        let pc = null;
        if (request.policy != null) {
            pc = request.policy.percent_coverage;
        }
        let payload = {
            visitation_id: request.other_id,
            percent_coverage: pc,
            procedures: r
        };
        fetch(`${healthcareURL}${healthcarePath}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
        console.log('PAYLOAD');
        console.log(payload);
        console.log(JSON.stringify(payload));
        cb(payload);
    } else {
        cb(null);
    }
}
module.exports.requestActionHC = requestActionHC;


async function applyTransaction(request, cb) {
    console.log('REQUEST');
    console.log(request);
    let result = await sequelize.query(
        'INSERT INTO transaction (transaction_date, request_id, policy_holder_id, amount) VALUES (CURDATE(), ?, (SELECT policy_holder_id FROM policy_holder WHERE policy_holder.first_name=? AND policy_holder.last_name=? AND policy_holder.address=? AND policy_holder.date_of_birth=? LIMIT 1))',
        {
            replacements: [
                request.request_id,
                request.first_name,
                request.last_name,
                request.address,
                request.date_of_birth,
            ],
            type: sequelize.QueryTypes.INSERT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    cb(result);
}
module.exports.applyTransaction = applyTransaction;

async function applyTransactionHC(request, cb) {
    console.log('REQUEST');
    console.log(request);
    let result = await sequelize.query(
        'INSERT INTO transaction_hc (transaction_hc_date, request_hc_id, policy_holder_id) VALUES (CURDATE(), ?, (SELECT policy_holder_id FROM policy_holder WHERE policy_holder.first_name=? AND policy_holder.last_name=? AND policy_holder.address=? AND policy_holder.date_of_birth=? LIMIT 1))',
        {
            replacements: [
                request.request_hc_id,
                request.first_name,
                request.last_name,
                request.address,
                request.date_of_birth,
            ],
            type: sequelize.QueryTypes.INSERT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    cb(result);
}
module.exports.applyTransactionHC = applyTransactionHC;
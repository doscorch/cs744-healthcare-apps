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

    let payload = {
        is_approved: request.request_status == 1,
        prescription_id: request.other_id,
        policy: request.policy,
        drug: {
            drug_code: request.drug_code,
            drug_name: request.drug_name,
            commercial_name: request.commercial_name
        }
    };
    fetch(`${pharmacyURL}${pharmacyPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    console.log('PAYLOAD');
    console.log(payload);

    cb(result);
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

    // check to see if for all other requests of the same visitation id, are NOT pending

    let count = await sequelize.query(
        'SELECT COUNT(*) FROM request_hc WHERE other_id=? AND request_hc_status = 2;',
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
            'SELECT * FROM request_hc JOIN `procedure` ON request_hc.procedure_id=procedure.procedure_id WHERE other_id=?;',
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
            r[i].is_approved = r.request_hc_status == 1;
        }

        let payload = {
            prescription_id: request.other_id,
            policy: request.policy,
            procedures: {
                r
            }
        };
        fetch(`${healthcareURL}${healthcarePath}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
        console.log('PAYLOAD');
        console.log(JSON.stringify(payload));
    }


    

    cb(result);
}
module.exports.requestActionHC = requestActionHC;


async function applyTransaction(request, cb) {
    console.log('REQUEST');
    console.log(request);
    let result = await sequelize.query(
        'INSERT INTO transaction (transaction_date, request_id, policy_holder_id) VALUES (CURDATE(), ?, (SELECT policy_holder_id FROM policy_holder WHERE policy_holder.first_name=? AND policy_holder.last_name=? AND policy_holder.address=? AND policy_holder.date_of_birth=? LIMIT 1))',
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
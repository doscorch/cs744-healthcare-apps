const sequelize = require('../db');

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
    cb(result);
}
module.exports.requestAction = requestAction;

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
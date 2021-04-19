const sequelize = require('../db');

async function getAllPolicyHolders(cb) {
    let result = await sequelize.query(
        'SELECT * FROM policy_holder JOIN policy ON policy_holder.policy_id=policy.policy_id;',
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
module.exports.getAllPolicyHolders = getAllPolicyHolders;


async function createPolicyHolder(ph, cb) {
    let result = await sequelize.query(
        'INSERT INTO policy_holder ( first_name, last_name, date_of_birth, address, policy_id, start_date, end_date, amount_paid, amount_remaining, policy_holder_status ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );',
        {
            replacements: [
                ph.first_name,
                ph.last_name,
                ph.date_of_birth,
                ph.address,
                ph.policy_id,
                ph.start_date,
                ph.end_date,
                ph.amount_paid,
                ph.amount_remaining,
                1
            ],
            type: sequelize.QueryTypes.INSERT
        }
    ).catch(function(e){
        console.log('SQL Error (create policy holder):');
        console.log(e);
        cb('Server Error');
    });
    cb(null);
}
module.exports.createPolicyHolder = createPolicyHolder;

async function updatePolicyHolder(ph, cb) {
    let result = await sequelize.query(
        'UPDATE policy_holder SET first_name=?, last_name=?, date_of_birth=?, address=?, policy_id=?, start_date=?, end_date=?, amount_paid=?, amount_remaining=?, policy_holder_status=? WHERE policy_holder_id=?;',
        {
            replacements: [
                ph.first_name,
                ph.last_name,
                ph.date_of_birth,
                ph.address,
                ph.policy_id,
                ph.start_date,
                ph.end_date,
                ph.amount_paid,
                ph.amount_remaining,
                ph.policy_holder_status,
                ph.policy_holder_id,
            ],
            type: sequelize.QueryTypes.UPDATE
        }
    ).catch(function(e){
        console.log('SQL Error (update policy holder):');
        console.log(e);
        cb('Server Error');
    });
    cb(null);
}
module.exports.updatePolicyHolder = updatePolicyHolder;


async function getTransactions(policy_holder_id, cb) {
    console.log('final');
    console.log(policy_holder_id);
    let result = await sequelize.query(
        'SELECT * FROM transaction JOIN request ON request.request_id=transaction.request_id JOIN drug ON drug.drug_id=request.drug_id JOIN policy_holder ON policy_holder.policy_holder_id=transaction.policy_holder_id JOIN policy ON policy.policy_id=policy_holder.policy_id WHERE transaction.policy_holder_id=?;',
        {
            replacements: [
                policy_holder_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    let returnResult = {transactions: result, transactions_hc: null};

    result = await sequelize.query(
        'SELECT * FROM transaction_hc JOIN request_hc ON request_hc.request_hc_id=transaction_hc.request_hc_id JOIN `procedure` ON procedure.procedure_id=request_hc.procedure_id JOIN policy_holder ON policy_holder.policy_holder_id=transaction_hc.policy_holder_id JOIN policy ON policy.policy_id=policy_holder.policy_id WHERE transaction_hc.policy_holder_id=?;',
        {
            replacements: [
                policy_holder_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });

    returnResult.transactions_hc = result;
    cb(returnResult);
}

module.exports.getTransactions = getTransactions;

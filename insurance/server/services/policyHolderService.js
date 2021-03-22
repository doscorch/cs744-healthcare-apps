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
        'INSERT INTO policy_holder ( first_name, last_name, date_of_birth, address, policy_id, start_date, end_date, amount_paid, amount_remaining ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? );',
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
        'UPDATE policy_holder SET first_name=?, last_name=?, date_of_birth=?, address=?, policy_id=?, start_date=?, end_date=?, amount_paid=?, amount_remaining=? WHERE policy_holder_id=?;',
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
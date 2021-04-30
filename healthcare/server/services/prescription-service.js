const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');
const userType = require('../models/user');

async function getPrescription(prescription_id, cb){
    let result = await sequelize.query('SELECT upat.first_name AS patient_first_name, upat.last_name AS patient_last_name, uphy.first_name AS physician_first_name, uphy.last_name AS physician_last_name, p.*, pati.date_of_birth, pati.address, phyi.physician_state, phyi.license_number FROM prescription_order AS p INNER JOIN user AS upat ON upat.user_id = p.patient_id INNER JOIN user AS uphy ON uphy.user_id = p.physician_id INNER JOIN physician_info AS phyi ON phyi.user_id = p.physician_id INNER JOIN patient_info AS pati ON pati.user_id = p.patient_id WHERE p.prescription_id = ?;',
    {
        replacements: [
            prescription_id
        ],
        type: sequelize.QueryTypes.SELECT
    })
    .catch(
        function(e){
            console.log("SQL error:");
            console.log(e);
            cb(e, null);
        }
    );
    cb(null, result);
}

module.exports.getPrescription = getPrescription;

async function getMedications(prescription_id, cb){
    let meds = await sequelize.query('SELECT pm.* FROM prescription_medicine AS pm WHERE prescription_order_id = ?;',
    {
        replacements:[
            prescription_id
        ],
        type: sequelize.QueryTypes.SELECT
    })
    .catch(
        function(e){
            console.log("SQL error:");
            console.log(e);
            cb(e, null);
        }
    );
    cb(null, meds);
}

module.exports.getMedications = getMedications;
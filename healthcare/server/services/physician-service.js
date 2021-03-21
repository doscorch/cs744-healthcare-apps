const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');
const userType = require('../models/user');

async function getPatients(physician_id, cb){
    let result = await sequelize.query(
        'SELECT user.*, pi.* FROM user INNER JOIN patient_physician AS pp ON pp.patient_id = user.user_id INNER JOIN patient_info AS pi ON pi.user_id = user.user_id WHERE pp.physician_id = ?;',
        {
            replacements: [
                physician_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log("SQL error:");
        console.log(e);
        cb(e, null);
    });
    cb(null, result);
}

module.exports.getPatients = getPatients;

async function getPatient(physician_id, patient_id, cb){
    let result = await sequelize.query(
        'SELECT user.*, pi.* FROM user INNER JOIN patient_physician AS pp ON pp.patient_id = user.user_id INNER JOIN patient_info AS pi ON pi.user_id = user.user_id WHERE pp.patient_id = ? AND user.user_type = 2 AND pp.physician_id = ?;',
        {
            replacements: [
                patient_id,
                physician_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log("SQL error:");
        console.log(e);
        cb(e, null);
    });
    cb(null, result);
}

module.exports.getPatient = getPatient;

async function getPhysician(physician_id, cb){
    let result = await sequelize.query(
        'SELECT user.*, pi.* FROM user INNER JOIN physician_info AS pi ON pi.user_id = user.user_id WHERE user.user_id = ?;',
        {
            replacements: [
                physician_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log("SQL error:");
        console.log(e);
        cb(e, null);
    });
    cb(null, result);
}

module.exports.getPhysician = getPhysician;

async function savePrescription(prescription,cb){
    await sequelize.query(
        'INSERT INTO prescription (physician_id, patient_id, prescription, dosage, quantity, refill) VALUES (?, ?, ?, ?, ?, ?);',
        {
            replacements: [
                prescription.physician_id,
                prescription.patient_id,
                prescription.prescription,
                prescription.dosage,
                prescription.quantity,
                prescription.refill
            ],
            type: sequelize.QueryTypes.INSERT
        }
    ).catch(
        function(e){
            console.log("SQL error:");
            console.log(e);
            cb(e);
        });
    cb(null);
}

module.exports.savePrescription = savePrescription;
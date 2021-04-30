const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');
const userType = require('../models/user');
const pharmacyClient = require('../service-client/pharmacyClient');
const insuranceClient = require('../service-client/insuranceClient');

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
    var currTime = new Date();
    let queryRes = await sequelize.query(
        'INSERT INTO prescription_order (physician_id, patient_id, creation_date) VALUES (?, ?, ?);',
        {
            replacements: [
                prescription.physician.user_id,
                prescription.patient.user_id,
                currTime
            ],
            type: sequelize.QueryTypes.INSERT,
            returning: true
        }
    ).catch(
        function(e){
            console.log("SQL error:");
            console.log(e);
            cb(e);
    });
    if (typeof queryRes === 'string' || queryRes instanceof String) {
        cb(queryRes);
        return;
    }
    prescription.date = currTime;
    
    let insertId = queryRes[0];
    prescription.prescription_id = insertId;
    prescription.prescriptions.forEach(async element => {
        await sequelize.query(
            'INSERT INTO prescription_medicine (prescription_order_id, prescription, dosage, quantity, refill) VALUES (?, ?, ?, ?, ?);',
            {
                replacements: [
                    insertId,
                    element.prescription,
                    element.dosage,
                    element.quantity,
                    element.refill
                ],
                type: sequelize.QueryTypes.INSERT
            }
        ).catch(
            function(e){
                console.log("SQL error:");
                console.log(e);
                cb(e);
                return;
        });
    });

    console.log(prescription);
    cb(null);
    return;
}

module.exports.savePrescription = savePrescription;

async function sendPrescription(presciption, cb){
    pharmacyClient.api.post('/healthcare/recieve/prescription', presciption).then(response => {
        console.log(response);
        cb(null);
        return;
    });
    cb(null);
    return;
}

module.exports.sendPrescription = sendPrescription;

async function saveVisitation(visitation,cb){
    var currTime = new Date();
    let queryRes = await sequelize.query(
        'INSERT INTO visitation (physician_id, patient_id, visitation_date, status) VALUES (?, ?, ?, 3);',
        {
            replacements: [
                visitation.physician.user_id,
                visitation.patient.user_id,
                currTime
            ],
            type: sequelize.QueryTypes.INSERT,
            returning: true
        }
    ).catch(
        function(e){
            console.log("SQL error:");
            console.log(e);
            cb(e, null);
    });
    if (typeof queryRes === 'string' || queryRes instanceof String) {
        cb(queryRes, null);
        return;
    }
    visitation.date = currTime;
    
    let insertId = queryRes[0];
    visitation.visitation_id = insertId;
    visitation.procedures.forEach(async element => {
        await sequelize.query(
            'INSERT INTO visitation_procedure (visitation_id, procedure_id) VALUES (?, ?);',
            {
                replacements: [
                    insertId,
                    element.procedure_id
                ],
                type: sequelize.QueryTypes.INSERT
            }
        ).catch(
            function(e){
                console.log("SQL error:");
                console.log(e);
                cb(e, null);
                return;
        });
    });

    console.log(visitation);
    cb(null, visitation);
    return;
}

module.exports.saveVisitation = saveVisitation;

async function sendVisitation(visitation, cb){
    insuranceClient.insuranceAPI.post('/policy/getPolicyByPatient', visitation).then(response => {
        console.log("response: ");
        console.log(response);
        cb(null, response);
        return;
    }).catch((e)=>{
        cb(e, null);
    });
    return;
}

module.exports.sendVisitation = sendVisitation;

async function getPatientPrescriptions(patient_id, cb){
    let result = await sequelize.query('SELECT upat.first_name AS patient_first_name, upat.last_name AS patient_last_name, uphy.first_name AS physician_first_name, uphy.last_name AS physician_last_name, p.*, pm.* FROM prescription_order AS p INNER JOIN user AS upat ON upat.user_id = p.patient_id INNER JOIN user AS uphy ON uphy.user_id = p.physician_id INNER JOIN prescription_medicine AS pm ON pm.prescription_order_id = p.prescription_id WHERE patient_id = ?;',
    {
        replacements: [
            patient_id
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

module.exports.getPatientPrescriptions = getPatientPrescriptions;

async function firstVisitationResponse(visitation, response, cb){
        await sequelize.query('UPDATE visitation SET status = 2 WHERE visitation_id = ?;',
        {
            replacements:[
                visitation.visitation_id
            ],
            type: sequelize.QueryTypes.UPDATE
        }).catch(
            function(e){
                console.log("SQL error:");
                console.log(e);
                cb(e, null);
            }
        );
}

module.exports.firstVisitationResponse = firstVisitationResponse;
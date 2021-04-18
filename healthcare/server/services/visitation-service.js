const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');
const userType = require('../models/user');

async function getPatientVisitations(patient, cb){
    let visitations = await sequelize.query('SELECT v.*, patu.first_name as patient_first, patu.last_name as patient_last, phyu.first_name as physician_first, phyu.last_name as physician_last FROM visitation AS v INNER JOIN user AS patu ON patu.user_id = v.patient_id INNER JOIN user AS phyu ON phyu.user_id = v.physician_id WHERE v.patient_id = ?;',
    {
        replacements:[
            patient
        ],
        type: sequelize.QueryTypes.SELECT
    }).catch(
        function(e){
            console.log("SQL error:");
            console.log(e);
            cb(e, null);
        }
    );
    cb(null, visitations);
}

module.exports.getPatientVisitations = getPatientVisitations;

async function getVisitation(visit, cb){
    let visitation = await sequelize.query('SELECT v.*, patu.first_name as patient_first, patu.last_name as patient_last, phyu.first_name as physician_first, phyu.last_name as physician_last, pati.address, pati.date_of_birth, phyi.physician_state, phyi.license_number FROM visitation AS v INNER JOIN user AS patu ON patu.user_id = v.patient_id INNER JOIN user AS phyu ON phyu.user_id = v.physician_id INNER JOIN patient_info as pati ON v.patient_id = pati.user_id INNER JOIN physician_info as phyi ON phyi.user_id = v.physician_id WHERE v.visitation_id = ?;',
    {
        replacements:[
            visit
        ],
        type: sequelize.QueryTypes.SELECT
    }).catch(
        function(e){
            console.log("SQL error:");
            console.log(e);
            cb(e, null);
        }
    );
    cb(null, visitation);
}
module.exports.getVisitation = getVisitation;


async function getVisitationProcedures(visit, cb){
    let procedures = await sequelize.query('SELECT * FROM visitation_procedure as vp INNER JOIN medical_procedure AS mp ON vp.procedure_id = mp.procedure_id WHERE visitation_id = ?',
    {
        replacements:[
            visit
        ],
        type: sequelize.QueryTypes.SELECT
    }).catch(
        function(e){
            console.log("SQL error:");
            console.log(e);
            cb(e, null);
        }
    );
    cb(null, procedures);
}

module.exports.getVisitationProcedures = getVisitationProcedures;
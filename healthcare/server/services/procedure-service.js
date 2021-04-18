const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');
const userType = require('../models/user');

async function getProcedures(cb){
    let procedures = await sequelize.query('SELECT * FROM medical_procedure;',
    {
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

module.exports.getProcedures = getProcedures;
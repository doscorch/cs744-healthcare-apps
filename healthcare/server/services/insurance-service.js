const { update } = require('../data-repositories/dbmodels/user');
const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');
const userType = require('../models/user');

async function updateVisitation(response, cb){
    await sequelize.query('UPDATE visitation SET status = 1 WHERE visitation_id = ?;',
        {
            replacements:[
                response.prescription_id
            ],
            type: sequelize.QueryTypes.UPDATE
        }).catch(
            function(e){
                console.log("SQL error:");
                console.log(e);
                cb(e, null);
            }
        );
    
        response.procedures.r.filter( async (procedure) => {
            console.log(procedure);
            await sequelize.query('UPDATE visitation_procedure SET insurance_pays = ? WHERE visitation_id = ? AND procedure_id = ?;',
            {
                replacements:[
                    procedure.procedure_price * (parseFloat(response.policy.percent_coverage) / 100),
                    response.prescription_id,
                    procedure.procedure_id_hc
                ],
                type: sequelize.QueryTypes.UPDATE
            }
            ).catch(
                function(e){
                    console.log("SQL error:");
                    console.log(e);
                    cb(e, null);
                }
            );
        })
        return;
}

module.exports.updateVisitation = updateVisitation;
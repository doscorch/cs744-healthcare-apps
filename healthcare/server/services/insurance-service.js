const { update } = require('../data-repositories/dbmodels/user');
const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');
const userType = require('../models/user');

async function updateVisitation(response, cb){
    await sequelize.query('UPDATE visitation SET status = 1 WHERE visitation_id = ?;',
        {
            replacements:[
                response.data.visitation_id
            ],
            type: sequelize.QueryTypes.UPDATE
        }).catch(
            function(e){
                console.log("SQL error:");
                console.log(e);
                cb(e, null);
            }
        );
    
        response.data.procedures.filter( async (procedure) => {
            await sequelize.query('UPDATE visitation_procedure SET insurance_pays = ? WHERE visitation_id = ? AND procedure_id = ?;',
            {
                replacements:[
                    procedure.price * (response.data.policy.percent_coverage / 100),
                    response.data.visitation_id,
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
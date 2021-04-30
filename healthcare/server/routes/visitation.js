const express = require('express');
const router = express.Router();
const _visitationService = require('../services/visitation-service');
const _physicianService = require('../services/physician-service');
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/:patient', isAuthenticated, function(req, res){
    _visitationService.getPatientVisitations(req.params.patient, function(err, visitations){
        if(err){
            res.status('500').send();
            return;
        }
        console.log(visitations);
        res.send(visitations);
        return;
    });
});

router.get('/visit/:visit', isAuthenticated, async function(req, res){
    let ret_visit = null
    error = false;
    await _visitationService.getVisitation(req.params.visit, function(err, visitation){
        if(err){
            error = true;
            return;
        }
        ret_visit = visitation[0];
    });
    await _visitationService.getVisitationProcedures(req.params.visit, function(err, procedures){
            if(err){
                error = true;
                return;
            }
            console.log(procedures);
            ret_visit['procedures'] = procedures;   
    });
    if(error){
        res.status('500').send();
        return;
    }
    console.log(ret_visit)
    res.send(ret_visit);
    return;
});

router.post('/visit/send', isAuthenticated, async function(req, res){
    let error_found = false;
    await _physicianService.sendVisitation(req.body, async function(err, response){
        if(!response){
            res.status('500').send({ err: "Failed to send prescription."})
            error_found = true;
            return;
        }else{
            await _physicianService.firstVisitationResponse(req.body, response, async function(err, res){
                if(err){
                    res.status('500').send({ error: "Failed to save visitation."})
                    error_found = true;
                    return;
                } 
            })
            res.status.apply('200').send({ msg: "Prescription Saved!"});
            return;
        } 
        return;
    })
    if(error_found){
        res.status('500').send();
        return;
    }
    return;
});

module.exports = router;
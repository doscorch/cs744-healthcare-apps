const express = require('express');
const router = express.Router();
const _prescriptionService = require('../services/prescription-service');
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/:prescription/medicine/:prescriptionmed', isAuthenticated, function(req, res){
    console.log(req.params);
    _prescriptionService.getPrescription(parseInt(req.params.prescription), parseInt(req.params.prescriptionmed), async function(err, prescription){
        if (err) {
            res.status('500').send();
            return;
        }
        if(prescription.length == 0){
            res.status('404').send({error: "Medicine/prescription not found"});
            return;
        }
        var authorized = true;
        prescription = prescription[0];
        await _userService.getPatientInfo(prescription.patient_id, function(error, patient){
            console.log(patient);
            patient = patient[0];
            if (!(req.session.user.user_id == prescription.patient_id || req.session.user.user_id == prescription.physician_id || (patient.physician_id == prescription.physician_id && req.session.user.user_type == 3))){
                console.log("here");
                authorized = false;
            }
            return;
        })
        console.log(authorized);
        if(!authorized){
            console.log("here--send");
            res.status('403').send({error: "You are not this patient or the assigned physician for this patient"});
            return;
        }
        console.log(prescription);
        res.send(prescription);
        return;
        });
        
});

module.exports = router;
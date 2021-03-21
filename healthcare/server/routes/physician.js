const express = require('express');
const router = express.Router();
const _physicianService = require('../services/physician-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/patients', isAuthenticated, function (req, res) {
    _physicianService.getPatients(req.session.user.user_id, function (err, users) {
        if (err) {
            res.status('500').send();
            return;
        }
        users.forEach(user => {
            delete user.password;
        });
        console.log(users);
        res.send(users);
        return;
    });
});

router.get('/', isAuthenticated, function (req, res) {
    _physicianService.getPhysician(req.session.user.user_id, function (err, physician){
        if (err) {
            res.status('500').send();
            return;
        }
        if(physician.length == 0){
            console.log("here")
            res.status('403').send({ err: "Must be logged in as a physician to write a prescription" });
            return;
        }

        physician = physician[0];
        delete physician.password;

        console.log(physician);
        res.send(physician);
        return;
    })
});

router.get('/patients/:patient', isAuthenticated, function (req, res) {
    _physicianService.getPatient(req.session.user.user_id, req.params.patient, function (err, patient){
        if (err) {
            res.status('500').send();
            return;
        }
        if(patient.length == 0){
            res.status('403').send({ err: "This patient is not assigned to the current physician" });
            return;
        }
        patient = patient[0];
        delete patient.password;

        console.log(patient);
        res.send(patient);
        return;
    })
});

router.post('/savePrescription', isAuthenticated, function(req, res){
    _physicianService.savePrescription(req.body, function(err){
        //Add send prescription to pharmacy
        if(err){
            res.status('500').send({ err: "Failed to save prescription."})
        }else{
            res.send({ msg: "Prescription Saved!"});
        }   
        return;
    })
})

module.exports = router;
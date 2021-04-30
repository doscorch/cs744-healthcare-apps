const express = require('express');
const router = express.Router();
const _physicianService = require('../services/physician-service');
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/:physician/patients', isAuthenticated, function (req, res) {
    _physicianService.getPatients(req.params.physician, function (err, users) {
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

router.get('/patients/:patient/prescriptions', isAuthenticated, async function(req, res) {
    console.log(req.params);
    var auth = true;
    await _userService.getPatientInfo(parseInt(req.params.patient), function(error, patient){
        console.log(patient);
        patient = patient[0];
        if(!(req.session.user.user_id == parseInt(req.params.patient) || req.session.user.user_id == patient.physician_id || req.session.user.user_type == 4)){
            auth = false;
        }
    })
    if (!auth){
        res.status('403').send({ err: "You are not this patient or you are not a physician assigned to this physician" });
            return;
    }
    _physicianService.getPatientPrescriptions(parseInt(req.params.patient), function (err, prescriptions){
        if (err) {
            res.status('500').send({ err: err});
            return;
        }
        res.send(prescriptions);
        return;
    })
})

router.post('/savePrescription', isAuthenticated, async function(req, res){
    await _physicianService.savePrescription(req.body, async function(err){
        
        if(err){
            res.status('500').send({ err: "Failed to save prescription."})
            return;
        } 
        console.log("sending prescription")

        await _physicianService.sendPrescription(req.body, async function(err){
            if(err){
                res.status('500').send({ err: "Failed to send prescription."})
            }else{
                res.send({ msg: "Prescription Saved!"});
            } 
            return;
        })
        return;
    })
})

router.post('/saveVisitation', isAuthenticated, async function(req, res){
    await _physicianService.saveVisitation(req.body, async function(err, visitation){
        //Add send visitaiton to insurance
        if(err){
            res.status('500').send({ error: "Failed to save visitation."})
            return;
        } 
        res.send('200');
        return;
    })
})

module.exports = router;
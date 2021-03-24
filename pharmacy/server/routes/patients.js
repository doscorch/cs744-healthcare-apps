const express = require('express');
const router = express.Router();
const _patientService = require('../services/patients-service');
const { isAuthenticated, isPharmacist } = require('../middleware/auth');

// get patients
router.get('/', isAuthenticated, isPharmacist, function (req, res) {
    _patientService.getAllPatients(function (err, patients) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(patients);
        return;
    });
});

// post patient
router.post('/', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.body) {
        res.status('400').send();
        return;
    }

    _patientService.createPatient(req.body, function (err, patient) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(patient);
        return;
    });
});

// patch a patient
router.patch('/:patientId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.patientId || !req.body) {
        res.status('400').send();
        return;
    }

    _patientService.patchPatient(req.params.patientId, req.body, function (err, patient) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(patient);
        return;
    });
});

// delete a patient
router.delete('/:patientId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.patientId) {
        res.status('400').send();
        return;
    }

    _patientService.deletePatient(req.params.patientId, function (err, patient) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(patient);
        return;
    });
});

module.exports = router;

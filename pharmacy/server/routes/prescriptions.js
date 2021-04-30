const express = require('express');
const router = express.Router();
const _prescriptionService = require('../services/prescriptions-service');
const { isAuthenticated, isPharmacist } = require('../middleware/auth');

// get prescriptions
router.get('/', isAuthenticated, isPharmacist, function (req, res) {
    _prescriptionService.getAllPrescriptions(function (err, prescriptions) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(prescriptions);
        return;
    });
});

// post prescription
router.post('/', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.body) {
        res.status('400').send();
        return;
    }

    _prescriptionService.createPrescription(req.body, function (err, prescription) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(prescription);
        return;
    });
});

// get a prescription
router.get('/:prescriptionId', isAuthenticated, isPharmacist, function (req, res) {
    console.log('here');
    if (!req.params.prescriptionId || !req.body) {
        res.status('400').send();
        return;
    }

    _prescriptionService.getPrescription(req.params.prescriptionId, function (err, prescription) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(prescription);
        return;
    });
});

// get prescriptions by order id
router.get('/order/:orderId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.orderId || !req.body) {
        res.status('400').send();
        return;
    }

    _prescriptionService.getPrescriptionsByOrderId(req.params.orderId, function (err, prescriptions) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(prescriptions);
        return;
    });
});


// patch a prescription
router.patch('/:prescriptionId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.prescriptionId || !req.body) {
        res.status('400').send();
        return;
    }

    _prescriptionService.patchPrescription(req.params.prescriptionId, req.body, function (err, prescription) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(prescription);
        return;
    });
});

// delete a prescription
router.delete('/:prescriptionId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.prescriptionId) {
        res.status('400').send();
        return;
    }

    _prescriptionService.deletePrescription(req.params.prescriptionId, function (err, prescription) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(prescription);
        return;
    });
});

module.exports = router;

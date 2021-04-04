const express = require('express');
const router = express.Router();
const _medicineService = require('../services/medicines-service');
const { isAuthenticated, isPharmacist } = require('../middleware/auth');

// get medicines
router.get('/', isAuthenticated, isPharmacist, function (req, res) {
    _medicineService.getAllMedicines(function (err, medicines) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(medicines);
        return;
    });
});

// post medicine
router.post('/', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.body) {
        res.status('400').send();
        return;
    }

    _medicineService.createMedicine(req.body, function (err, medicine) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(medicine);
        return;
    });
});

// patch a medicine
router.patch('/:medicineId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.medicineId || !req.body) {
        res.status('400').send();
        return;
    }

    _medicineService.patchMedicine(req.params.medicineId, req.body, function (err, medicine) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(medicine);
        return;
    });
});

// delete a medicine
router.delete('/:medicineId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.medicineId) {
        res.status('400').send();
        return;
    }

    _medicineService.deleteMedicine(req.params.medicineId, function (err, medicine) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(medicine);
        return;
    });
});

module.exports = router;

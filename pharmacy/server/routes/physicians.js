const express = require('express');
const router = express.Router();
const _physicianService = require('../services/physicians-service');
const { isAuthenticated, isPharmacist } = require('../middleware/auth');

// get physicians
router.get('/', isAuthenticated, isPharmacist, function (req, res) {
    _physicianService.getAllPhysicians(function (err, physicians) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(physicians);
        return;
    });
});

// post physician
router.post('/', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.body) {
        res.status('400').send();
        return;
    }

    _physicianService.createPhysician(req.body, function (err, physician) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(physician);
        return;
    });
});

// patch a physician
router.patch('/:physicianId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.physicianId || !req.body) {
        res.status('400').send();
        return;
    }

    _physicianService.patchPhysician(req.params.physicianId, req.body, function (err, physician) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(physician);
        return;
    });
});

// delete a physician
router.delete('/:physicianId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.physicianId) {
        res.status('400').send();
        return;
    }

    _physicianService.deletePhysician(req.params.physicianId, function (err, physician) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(physician);
        return;
    });
});

module.exports = router;

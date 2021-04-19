const express = require('express');
const router = express.Router();
const _physicianService = require('../services/physicians-service');
const { isAuthenticated } = require('../middleware/auth');

// get physicians
router.get('/', isAuthenticated, function (req, res) {
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
router.post('/', isAuthenticated, function (req, res) {
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
router.patch('/:physicianId', isAuthenticated, function (req, res) {
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
router.post('/delete/:physicianId', isAuthenticated, function (req, res) {
    console.log('I hear ya');
    if (!req.params.physicianId) {
        res.status('400').send();
        return;
    }

    _physicianService.deletePhysician(parseInt(req.params.physicianId), function (err, physician) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(physician);
        return;
    });
});

// get a physician
router.get('/:physicianId', isAuthenticated, function (req, res) {
    console.log('here');
    if (!req.params.physicianId || !req.body) {
        res.status('400').send();
        return;
    }

    _physicianService.getPhysician(req.params.physicianId, function (err, physician) {
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

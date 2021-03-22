const express = require('express');
const router = express.Router();
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const _policyHolderService = require('../services/policyHolderService');

router.get('/getAllPolicyHolders', isAuthenticated, function (req, res, next) {
    _policyHolderService.getAllPolicyHolders(function(data) {
        res.send({ data: data });
    });
});

router.post('/createPolicyHolder', isAuthenticated, function (req, res, next) {
    _policyHolderService.createPolicyHolder(req.body, function(data) {
        res.send({ data: data });
    });
});

module.exports = router;

router.post('/updatePolicyHolder', isAuthenticated, function (req, res, next) {
    _policyHolderService.updatePolicyHolder(req.body, function(data) {
        res.send({ data: data });
    });
});

module.exports = router;

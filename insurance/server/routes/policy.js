const express = require('express');
const router = express.Router();
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const _policyService = require('../services/policyService');

/**
 * Post request to get all policies. Triggered in client>src>policy>policyService.js
 * 
 * @param req - req.body is an object of input values for registration
 * 
 * @author Sahee Thao
 */
router.get('/getAllPolicies', isAuthenticated, function (req, res, next) {
    _policyService.getAllPolicies(function(data) {
        res.send({ data: data });
    });
});

/**
 * A GET request for retrieving a policy's drugs

 */
router.get('/getDrugs/:policy_id', isAuthenticated, function (req, res, next) {
    _policyService.getDrugsFromPolicyId(parseInt(req.params.policy_id), function (result) {
        res.send({ data: result});
    })
});

router.get('/getAllDrugs', isAuthenticated, function (req, res, next) {
    _policyService.getAllDrugs(function(data) {
        res.send({ data: data });
    });
});

router.post('/createPolicy', isAuthenticated, function (req, res, next) {
    _policyService.createPolicy(req.body, function(data) {
        res.send({ data: data });
    });
});

router.post('/updatePolicy', isAuthenticated, function (req, res, next) {
    _policyService.updatePolicy(req.body, function(data) {
        res.send({ data: data });
    });
});

router.post('/getPolicyHoldersWithPolicy', isAuthenticated, function (req, res, next) {
    _policyService.getPolicyHoldersWithPolicy(req.body, function (data) {
        res.send({data: data});
    });
});

router.post('/getPolicyByPatient', function (req, res, next) {
    console.log('recieved');
    _policyService.getPolicyByPatient(req.body, function (data) {
        res.send({data: data});
    });
});

router.post('/getPolicyByPatientPharmacy', function (req, res, next) {
    _policyService.getPolicyByPatientPharmacy(req.body, function (data) {
        res.send({data: data});
    });
});

router.post('/getPolicyByPatientPharmacyUpdate', function (req, res, next) {
    _policyService.getPolicyByPatientPharmacyUpdate(req.body, function (data) {
        res.send({data: data});
    });
});

router.post('/getPolicyByPatientUpdate', function (req, res, next) {
    _policyService.getPolicyByPatientUpdate(req.body, function (data) {
        res.send({data: data});
    });
});

router.get('/getProcedures/:policy_id', isAuthenticated, function (req, res, next) {
    _policyService.getProceduresFromPolicyId(parseInt(req.params.policy_id), function (result) {
        res.send({ data: result});
    })
});

router.get('/getAllProcedures', isAuthenticated, function (req, res, next) {
    _policyService.getAllProcedures(function(data) {
        res.send({ data: data });
    });
});

module.exports = router;
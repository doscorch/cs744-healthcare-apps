const express = require('express');
const router = express.Router();
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const _requestService = require('../services/requestService');

/**
 * Post request to get all policies. Triggered in client>src>policy>policyService.js
 * 
 * @param req - req.body is an object of input values for registration
 * 
 * @author Sahee Thao
 */
router.get('/getAllRequests', isAuthenticated, function (req, res, next) {
    _requestService.getAllRequests(function(data) {
        res.send({ data: data });
    });
});

router.get('/getDrug/:drug_id', isAuthenticated, function (req, res, next) {
    _requestService.getDrug(parseInt(req.params.drug_id), function (data) {
        res.send({ data: data});
    })
});

router.get('/getAllRequestsHC', isAuthenticated, function (req, res, next) {
    _requestService.getAllRequestsHC(function(data) {
        res.send({ data: data });
    });
});

router.get('/getProcedure/:procedure_id', isAuthenticated, function (req, res, next) {
    _requestService.getProcedure(parseInt(req.params.procedure_id), function (data) {
        res.send({ data: data});
    })
});

router.post('/requestAction', isAuthenticated, function (req, res, next) {
    _requestService.requestAction(req.body, function (data) {
        res.send({data});
    })
});

router.post('/requestActionHC', isAuthenticated, function (req, res, next) {
    _requestService.requestActionHC(req.body, function (data) {
        res.send({data});
    })
});

router.post('/applyTransaction', isAuthenticated, function (req, res, next) {
    _requestService.applyTransaction(req.body, function (data) {
        res.send({data});
    })
});

router.post('/applyTransactionHC', isAuthenticated, function (req, res, next) {
    _requestService.applyTransactionHC(req.body, function (data) {
        res.send({data});
    })
});
module.exports = router;
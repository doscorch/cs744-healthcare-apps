const express = require('express');
const router = express.Router();
const _procedureService = require('../services/procedure-service');
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', isAuthenticated, function(req, res){
    _procedureService.getProcedures(function(err, procedures){
        if(err){
            res.status('500').send();
            return;
        }
        res.send(procedures);
        return;
    });
});

module.exports = router;
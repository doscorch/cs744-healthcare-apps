const express = require('express');
const router = express.Router();
const _physicianService = require('../services/physician-service');
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const _insuranceService = require('../services/insurance-service');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.post('/visitation/response', async function(req,res){
    console.log(req.body);
    await _insuranceService.updateVisitation(req.body, async function(err, response){
        if(err){
            res.status('500').send({ error: "Failed to save visitation."})
            return;
        } 
        res.status('200').send();
    })
    return;
})

module.exports = router;
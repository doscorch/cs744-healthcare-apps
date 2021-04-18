const express = require('express');
const router = express.Router();
const _physicianService = require('../services/physician-service');
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.post('/visitation/response', async function(req,res){
    console.log(req.body);
    return;
})

module.exports = router;
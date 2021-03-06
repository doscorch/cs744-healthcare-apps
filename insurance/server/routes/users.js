const express = require('express');
const router = express.Router();
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { User_Type_Admin } = require('../models/user')
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// auth status
router.get('/', isAuthenticated, isAdmin, function (req, res) {
    _userService.getAllUsers(function (err, users) {
        if (err) {
            res.status('500').send();
            return;
        }
        users.forEach(user => {
            delete user.password;
        });
        console.log(users);
        res.send(users);
        return;
    });
});

// patch a user
router.patch('/:userId', isAuthenticated, isAdmin, function (req, res) {
    if (!req.params.userId || !req.body) {
        res.status('400').send();
        return;
    }

    _userService.patchUser(req.params.userId, req.body, function (err, user) {
        if (err) {
            res.status('500').send();
            return;
        }

        delete user.password;
        res.send(user);
        return;
    });
});

module.exports = router;

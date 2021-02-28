const express = require('express');
const router = express.Router();
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { User_Type_Admin } = require('../models/user')

// router.all('', function (req, res, next) {
//     console.log('all');
//     let authUser = req.session.user;
//     console.log(authUser);
//     console.log(req.headers['x-csrf']);

//     console.log(req.session);

//     if (authUser && req.headers['x-csrf'] && req.headers['x-csrf'] == req.session.csrf) {
//         next();
//     } else {
//         console.log('here');

//         req.session.regenerate(function (err) {
//             res.send();
//             return;
//         });
//     }
// });

// auth status
router.get('/get', function (req, res) {
    console.log("here!!!!!")
    console.log(req.session.user)

    if (req.session.user.user_type != User_Type_Admin) {
        res.status('403').send();
        return;
    } else {
        _userService.getAllUsers(function (err, users) {
            if (err) {
                res.status('500').send();
                return;
            }
            users.forEach(user => {
                delete user.password;
            });
            res.send(users);
            return;
        });
    }
});

module.exports = router;

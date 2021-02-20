const express = require('express');
const router = express.Router();
const _userService = require('../services/users-service');

// auth status
router.get('/status', function (req, res, next) {
    let user = req.session.user;
    let status = user ? true : false;
    if (user) {
        _userService.getUserById(user.id, function (err, userUpdated) {
            req.session.user = userUpdated;
            res.send({ status: status, user: userUpdated });
            return;
        });
    } else {
        res.send({ status: status, user: user });
        return;
    }
});

// login user
router.post('/login', function (req, res, next) {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status('400').send(new Error('invalid username or password'));
        return;
    }
    _userService.getUserByCredentials(req.body, function (err, user) {
        if (err) {
            res.status('500').send(new Error('no user in db'));
            return;
        }
        req.session.regenerate(function (err) {
            if (err) {
                res.status('500').send(new Error('session regenerate failed'));
                return;
            }
            if (!user) {
                res.status('400').send(new Error('invalid username or password'));
                return;
            }
            if (!user.enabled) {
                res.status('403').send(new Error('User disbled, contact an administrator for assistance'));
                return;
            }
            delete user.password;
            req.session.user = user;
            let csrf = new CSRF().value;
            req.session.csrf = csrf;
            res.setHeader('x-csrf', csrf);
            res.send(user);
            return;
        });
    });
});

// logout user
router.post('/logout', function (req, res, next) {
    req.session.regenerate(function (err) {
        res.send();
        return;
    });
});

module.exports = router;

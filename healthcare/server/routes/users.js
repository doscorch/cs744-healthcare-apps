const express = require('express');
const router = express.Router();
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');
const { User_Type_Admin, User_Type_Staff_Member } = require('../models/user')
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

router.post('/change-physician', isAuthenticated, function (req, res){
    _userService.changePhysician(req.session.user.user_id, req.body.physician_id, function(error){
        if(error){
            res.status('500').send();
            return;
        }
        res.send();
        return;
    })
})

router.get('/physician', isAuthenticated, function (req, res){
    _userService.getPhysicianInfo(req.session.user.user_id, function(error, result){
        if(error){
            console.log(error);
            res.status('500').send();
            return;
        }
        res.send(result[0]);
        return;
    });
});

router.get('/patient', isAuthenticated, function (req, res){
    _userService.getPatientInfo(req.session.user.user_id, function(error, result){
        if(error){
            console.log(error);
            res.status('500').send();
            return;
        }
        res.send(result[0]);
        return;
    });
});

router.get('/patients', isAuthenticated, function(req, res){
    if(req.session.user.user_type !== User_Type_Staff_Member){
        res.status('403').send({error: "Must be a staff member to access all patients"})
    }
    _userService.getPatients(function(error, result){
        if(error){
            console.log(error);
            res.status('500').send();
            return;
        }
        res.send(result);
        return;
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const _userService = require('../services/users-service');
const Token = require('../models/authToken');
const dataUser = require('../data-repositories/dbmodels/user');

// auth status
router.get('/status', function (req, res, next) {
    let user = req.session.user;
    let status = user ? true : false;
    if (user) {
        _userService.getUserById(user.user_id, function (err, userUpdated) {
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
        console.log("user")
        console.log(user);
        if(err){
            res.status('400').send({ msg: err});
            return;
        }
        if(!user){
            res.status('400').send({ msg: "Incorrect username or password"});
            return;
        }
        if(user.user_status>1){
            res.status('400').send({ msg: "User is blocked or deactivated. Please conatact an admin."});
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
            _userService.getQuestions(user.user_id, function(err, questions){
                let newOrder = new Array();
                while(questions.length>0){
                    const idx = Math.floor(Math.random()*(questions.length));
                    newOrder.push(questions[idx]);
                    questions.splice(idx, 1)
                }
                questions = newOrder;
                if(questions.length<3){
                    res.send({msg:"Insufficient security questions. Please conatact an admin."});
                    return;
                }
                delete user.password;
                req.session.user = user;
                req.session.user.questions = questions;
                req.session.user.answer_attempt = 1;
                req.session.user.is_validated = false;
                res.send({ data: user });
                return;
            });
            // if (!user.enabled) {
            //     res.status('403').send(new Error('User disbled, contact an administrator for assistance'));
            //     return;
            // }
            
        });
    });
});


/**
 * Post request to register a user. Triggered in client>src>auth>usersService.js
 * 
 * @param req - req.body is an object of input values for registration
 * 
 * @author Sahee Thao
 */
router.post('/register', function (req, res, next) {
    _userService.createUser(req.body, function (err) {
        res.send({ msg: err });
    });
});

/**
 * post request to update password for a user. Triggered in client>src>auth>usersService.js
 * 
 * @param req - req.body is an object of the username and password {username: ?, password: ?} 
 */
router.post('/updatePassword', function(req, res, next) {
    _userService.updatePassword(req.body, function (err) {
        res.send({ msg: err });
    });
});

/**
 * post request to update security questions for a user. Triggered in client>src>auth>usersService.js
 * 
 * @param req - req.body is an object of the username and questions and answers {username: ?, question1: ?, answer1: ? ...} 
 */
router.post('/updateSecurityQuestions', function(req, res, next) {
    _userService.updateSecurityQuestions(req.body, function (err) {
        res.send({ msg: err });
    });
});

/**
 * get request to get all security questions. Triggered in client>src>auth>usersService.js 
 * 
 * @author Sahee Thao
 */
router.get('/getSecurityQuestions', function(req, res, next) {
    _userService.getAllQuestions(function (result) {
        res.send({data: result});
    });
});

// logout user
router.post('/logout', function (req, res, next) {
    console.log("logout!!!!!")
    console.log(req.session.user)
    req.session.destroy();
    res.send();
});


/**
 * Post request for answering a security question for authentication. Triggered in client>src>auth>usersService.js
 * 
 * @param req - req.body has the attributes user, question_id, answer, attempt
 * 
 * @author Nathan Diedrick
 * 
 */
router.post('/answerquestion', function (req, res, next){
    _userService.answerQuestion(req.body, function(err, correct) {
        if(correct){
            let csrf = new Token().value;
            req.session.csrf = csrf;
            res.setHeader('x-csrf', csrf);
            req.session.user.isValidated = true;
        }else{
            req.session.user.answer_attempt += 1;
        }
        res.send({msg: err, correct:correct, user: req.session.user});
    })
});

/**
 * A GET request for retrieving a user's security questions
 * 
 * @author Nathan Diedrick
 */
router.get('/questions/:user_id', function (req,res, next){
    _userService.getQuestions(parseInt(req.params.user_id), function(err, questions){
        res.send({msg:err, questions: questions});
    })
});


module.exports = router;

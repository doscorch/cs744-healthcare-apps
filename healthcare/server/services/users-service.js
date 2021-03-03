const bcrypt = require('bcrypt');
const saltRounds = 10;
const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');
const userType = require('../models/user');

/**
 * Creates a user and hashes using bcrpyt
 * 
 * @param {*} user - requires properties of a user 
 * @param {*} cb
 * 
 * @date 03/03/2021
 * @author Sahee Thao
 */
async function createUser(user, cb) {
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;

    // set the user type to the correct number
    if (user.user_type == 'admin') {
        user.user_type = userType.User_Type_Admin;
    } else if (user.user_type == 'patient') {
        user.user_type = userType.User_Type_Patient;
    } else if (user.user_type == 'physician') {
        user.user_type = userType.User_Type_Physician;
    }

    const queryRes = await sequelize.query(
        'INSERT INTO `user` (username, password, first_name, last_name, user_status, user_type) values (?, ?, ?, ?, 1, ?)',
        {
            replacements: [
                user.username,
                user.password,
                user.firstName,
                user.lastName,
                user.user_type
            ],
            type: sequelize.QueryTypes.INSERT,
            returning: true
        }
    ).catch(function (e) {
        // error handling
        console.log('sql error (user):');
        if (e.errors != null) {
            console.log('some error');
            return 'The username must be unique';
        } else {
            console.log('unknown error');
            return 'Unknown error';
        }
    });
    if (typeof queryRes === 'string' || queryRes instanceof String) {
        cb(queryRes);
        return;
    }
    let insertId = queryRes[0];
    let infoRes = null;
    if (user.user_type == userType.User_Type_Admin) {
        // no extra inserts needed
    } else if (user.user_type == userType.User_Type_Patient) {
        // insert patient info
        infoRes = await sequelize.query(
            'INSERT INTO `patient_info` (user_id, date_of_birth, address) values (?, ?, ?)',
            {
                replacements: [
                    insertId,
                    user.date_of_birth,
                    user.address
                ],
                type: sequelize.QueryTypes.INSERT,
                returning: true
            }
        ).catch(function (e) {
            // error handling
            console.log('sql error (patient info):');
            console.log(e);
            return 'Database error';
        });
    } else if (user.user_type == userType.User_Type_Physician) {
        // insert physician info
        infoRes = await sequelize.query(
            'INSERT INTO `physician_info` (user_id, license_number) values (?, ?)',
            {
                replacements: [
                    insertId,
                    user.license_number
                ],
                type: sequelize.QueryTypes.INSERT,
                returning: true
            }
        ).catch(function (e) {
            // error handling
            console.log('sql error (physician info):');
            console.log(e);
            return 'Database error';
        });
    }

    if (typeof infoRes === 'string' || infoRes instanceof String) {
        cb(infoRes);
        return;
    }

    // security answers
    let securityAnswerError = await sequelize.query(
        'INSERT INTO `security_answer` (question_id, user_id, answer) values (?, ?, ?)',
        {
            replacements: [
                user.security_question_1,
                insertId,
                user.security_answer_1
            ],
            type: sequelize.QueryTypes.INSERT,
            returning: true
        }
    ).catch(function (e) {
        // error handling
        console.log('sql error (insert security answer 1):');
        console.log(e);
        return 'Database error';
    });

    if (typeof securityAnswerError === 'string' || securityAnswerError instanceof String) {
        cb(securityAnswerError);
        return;
    }

    securityAnswerError = await sequelize.query(
        'INSERT INTO `security_answer` (question_id, user_id, answer) values (?, ?, ?)',
        {
            replacements: [
                user.security_question_2,
                insertId,
                user.security_answer_2
            ],
            type: sequelize.QueryTypes.INSERT,
            returning: true
        }
    ).catch(function (e) {
        // error handling
        console.log('sql error (insert security answer 2):');
        console.log(e);
        return 'Database error';
    });

    if (typeof securityAnswerError === 'string' || securityAnswerError instanceof String) {
        cb(securityAnswerError);
        return;
    }

    securityAnswerError = await sequelize.query(
        'INSERT INTO `security_answer` (question_id, user_id, answer) values (?, ?, ?)',
        {
            replacements: [
                user.security_question_3,
                insertId,
                user.security_answer_3
            ],
            type: sequelize.QueryTypes.INSERT,
            returning: true
        }
    ).catch(function (e) {
        // error handling
        console.log('sql error (insert security answer 3):');
        console.log(e);
        return 'Database error';
    });

    if (typeof securityAnswerError === 'string' || securityAnswerError instanceof String) {
        cb(securityAnswerError);
        return;
    }

    cb(null);
}
module.exports.createUser = createUser;

// update user
function updateUser(user, cb) {
    delete user.password;
    _userRepository.updateUser(user, (err, user) => cb(err, user));
}
module.exports.updateUser = updateUser;

// getUserByCredentials used for login.. compare password with bcyrpted password
function getUserByCredentials(form, cb) {
    _userRepository.getUserByUsername(form.username, (err, user) => {
        if (err) throw err;
        if(!user){
            cb(err, user);
        }
        bcrypt.compare(form.password, user.password, function (err, res) {
            if (err) throw err;
            if (res == true){ 
                cb(err, user); 
            }else{
                cb("Incorrect username or password", null);
            }
        });
    });
}
module.exports.getUserByCredentials = getUserByCredentials;

// get all users.. used by admin
function getAllUsers(cb) {
    _userRepository.getAllUsers((err, users) => cb(err, users));
}
module.exports.getAllUsers = getAllUsers;

// get user by id 
function getUserById(userId, cb) {
    _userRepository.getUserById(userId, (err, user) => cb(err, user));
}
module.exports.getUserById = getUserById;


/**
 * 
 * @param {*} answerInfo - has the attributes user, question_id, answer, attempt
 * @param {*} cb 
 * 
 * 
 */
async function answerQuestion(answerInfo, cb) {
    //console.log(answerInfo);
    //get answer
    await sequelize.query(
        'SELECT answer_id, question_id, user_id, answer FROM `security_answer` WHERE user_id = ? AND question_id = ?;',
        {
            replacements: [
                answerInfo.user.user_id,
                answerInfo.user.questions[answerInfo.user.answer_attempt-1].question_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).then(async function (data) {
        let answer = data[0].answer;
        if (answerInfo.answer === answer) {
            cb(null, true);
        }else{
            if(answerInfo.user.answer_attempt == 3){
                //Block user
                await sequelize.query(
                    'UPDATE `user` SET user_status = 3 WHERE user_id = ?;',
                    {
                        replacements: [
                            answerInfo.user.user_id
                        ],
                        type: sequelize.QueryTypes.UPDATE
                    }
                ).catch(function (e) {
                    console.log(e);
                });
                cb("Incorrect. You're account has been blocked. Please contact an administrator.", false);
            } else {
                cb("Incorrect", false);
            }
        }
    }).catch(function (e) {
        console.log(e);
    });
}
module.exports.answerQuestion = answerQuestion;

async function getQuestions(user_id, cb) {
    await sequelize.query(
        'SELECT security_question.question_id, question FROM security_question NATURAL JOIN security_answer WHERE security_answer.user_id = :user_id;',
        {
            replacements: {
                user_id: user_id
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function(data){
        cb(null, data);
    }).catch(function(e){
        console.log(e);
    })
}

module.exports.getQuestions = getQuestions;

/**
 * @return Array<Object>
 */
async function getAllQuestions(cb) {
    let result = await sequelize.query(
        'SELECT * FROM security_question;',
        {
            type: sequelize.QueryTypes.SELECT
        }
    ).catch(function(e){
        console.log('SQL Error:');
        console.log(e);
        return null;
    });
    cb(result);
}

module.exports.getAllQuestions = getAllQuestions;

// partial update of user
function patchUser(userId, userPartial, cb) {
    _userRepository.patchUser(userId, userPartial, (err, user) => cb(err, user));
}
module.exports.patchUser = patchUser;

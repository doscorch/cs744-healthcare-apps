const bcrypt = require('bcrypt');
const saltRounds = 10;
const _userRepository = require('../data-repositories/users-repository');
const sequelize = require('../db');

/**
 * Creates a user and hashes using bcrpyt
 * 
 * @param {*} user - requires properties of a user 
 * @param {*} cb
 * 
 * @date 02/22/2021
 * @author Sahee Thao
 */
async function createUser(user, cb) {

    bcrypt.hash(user.password, saltRounds, async function (err, hash) {
        if (err) {
            console.log('Recieved bcrypt error');
            cb('Internal error');
            return;
        }
        user.password = hash;

        // TODO: change this later probably. idk how to use sequelize
        await sequelize.query(
            'INSERT INTO `user` (username, password, first_name, last_name, user_status, user_type) values (?, ?, ?, ?, 1, 1)',
            { 
                replacements:  [
                    user.username, 
                    user.password,
                    user.firstName,
                    user.lastName
                ]
                , 
                type: sequelize.QueryTypes.INSERT 
            }
        ).then(function (data) {
            // all good
            console.log('Inserted new user.');
            cb(null);
        }).catch(function (e) {
            // error handling
            console.log('sql error:');
            if (e.errors != null) {
                console.log('some error');
                cb('The username must be unique');
            } else {
                console.log('unknown error');
                cb('Internal database error');
            }
        });
        // _userRepository.createUser(user, (err, u) => cb(err, u));
    });

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
        bcrypt.compare(form.password, user.password, function (err, res) {
            if (err) throw err;
            if (res == true) cb(err, user);
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
async function answerQuestion(answerInfo, cb){
    //console.log(answerInfo);
    //get answer
    await sequelize.query(
        'SELECT answer_id, question_id, user_id, answer FROM `security_answer` WHERE user_id = ? AND question_id = ?;',
        {
            replacements: [
                answerInfo.user,
                answerInfo.question_id
            ],
            type: sequelize.QueryTypes.SELECT
        }
    ).then(async function(data){
        let answer = data[0].answer;
        if(answerInfo.answer === answer){
            cb(null, true);
        }else{
            if(answerInfo.attempt == 3){
                //Block user
                await sequelize.query(
                    'UPDATE `user` SET user_status = 2 WHERE user_id = ?;',
                    {
                        replacements: [
                            answerInfo.user
                        ],
                        type: sequelize.QueryTypes.UPDATE
                    }
                ).catch(function (e){
                    console.log(e);
                });
                cb("Incorrect. You're account has been blocked. Please contact an administrator.", false);
            }else{
                cb("Incorrect", false);
            }
        }
    }).catch(function (e){
        console.log(e);
    });
}
module.exports.answerQuestion = answerQuestion;

async function getQuestions(user_id,cb){
    await sequelize.query(
        'SELECT security_question.question_id, question FROM security_question NATURAL JOIN security_answer WHERE security_answer.user_id = :user_id;',
        {
            replacements: {
                user_id: user_id
            },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function(data){
        cb("", data);
    }).catch(function(e){
        console.log(e);
    })
}

module.exports.getQuestions = getQuestions;
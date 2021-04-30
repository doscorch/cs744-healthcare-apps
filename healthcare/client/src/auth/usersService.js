
import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

const users = {};
// call api to register user

/**
 * 
 * @param {String} username 
 * @param {String} password 
 * @param {String} firstName - TODO: refactor name
 * @param {String} lastName - TODO: refactor name
 * @param {String} user_type - admin, patient, physician only 
 * @param {String} security_answer_1 
 * @param {String} security_answer_2 
 * @param {String} security_answer_3 
 * @param {Integer} security_question_1 
 * @param {Integer} security_question_2 
 * @param {Integer} security_question_3 
 * @param {String} address 
 * @param {String} date_of_birth 
 * @param {String} license_number
 * 
 * @return {object} - contains msg property. If msg is null, there was a success. If msg is not null, it contains an error message
 */
export const registerUser = async (username, password, firstName, lastName,
    user_type, security_answer_1, security_answer_2, security_answer_3,
    security_question_1, security_question_2, security_question_3,
    address, date_of_birth, physician_id, license_number, physician_state) => {
    let args = {
        username,
        password,
        firstName,
        lastName,
        user_type,

        security_question_1,
        security_answer_1,
        security_question_2,
        security_answer_2,
        security_question_3,
        security_answer_3,

        address,
        date_of_birth,
        physician_id,
        license_number,
        physician_state
    };

    return client.post('/auth/register', args).then(res => {
        return {
            msg: res.msg,
        };
    });
}

export const updatePassword = async (username, password) => {
    let args = {username, password};
    return client.post('/auth/updatePassword', args).then(res => {
        return {
            msg: res.msg,
        };
    });
}

export const updateSecurityQuestions = async(username, security_question_1, security_answer_1, 
    security_question_2, security_answer_2, security_question_3, security_answer_3) => {
        let args = {username, security_question_1, security_answer_1, 
            security_question_2, security_answer_2, security_question_3, security_answer_3};
            return client.post('/auth/updateSecurityQuestions', args).then(res => {
                return {
                    msg: res.msg,
                }
            });
    }

/**
 * Gets all security questions
 */
export const getAllSecurityQuestions = async () => {
    return client.get('/auth/getSecurityQuestions').then(res => {
        return {
            data: res.data
        };
    });
}

// call api to get users
export const getUsers = async () => {
    return client.get('/users').then(users => {
        return users;
    })
}

export const getQuestions = async (user) => {
    const response = await client.get('/auth/questions/' + user.user_id);
    return response.questions;
}

export const getPhysicians = async () =>{
    return client.get('/auth/getPhysicians').then(res =>{
        return {
            data: res.data
        };
    })
}

//call api to check security question answer
export const answerSecurityQuestion = async (user, answer) => {
    let response = client.post('/auth/answerquestion', 
    {
        user: user,
        answer: answer
    });
    return response;
}

// call api to register user by username
export const getUser = async (username) => {
    client.get(`/users/${username}`).then(user => {
        return user;
    })
    return users.find({
        query: {
            username: username
        }
    }).then(u => u.data.length ? u.data[0] : undefined)
}

// call api to update user
export const updateUser = async (user) => {
    // await users.update(user._id, user, {});
}

// call api to patch user
export const patchUser = async (userId, userPartial) => {
    return await client.patch(`/users/${userId}`, userPartial);
}

// call api to login user
export const loginUser = async (username, password) => {
    try {
        if (!username && !password) {
            let auth = await client.reAuthenticate();
            return {
                userId: auth.user?._id,
                username: auth.user?.username,
                error: false,
            }
        } else {
            return client.post('/auth/login', { username, password }).then(res => {
                return {
                    user: res.data,
                    msg: res.msg,
                }
            })
        }
    } catch (error) {
        let message = error?.message ?? ERROR;
        return {
            error: message,
        };
    }
}

// logout user on client
export const logout = async () => {
    return await client.post('/auth/logout');
}

export const changePhysician = async (physician_id) => {
    return await client.post('/users/change-physician',
    {
        physician_id: physician_id
    });
}

export const getPhysicianInfo = async () => {
    let result  = await client.get('/users/physician');
    return result;
}

export const getPhysicianInfoById = async (id) => {
    let result  = await client.get('/users/physician/'+id);
    return result;
}

export const updatePhysicianInfo = async (id, license_number, physician_state) => {
    let response = await client.post('/users/physician/'+id,
    {
        physician_state: physician_state,
        license_number: license_number
    });
    console.log(response);
    return response;
}

export const getPatientInfo = async () => {
    let result = await client.get('/users/patient');
    return result;
}

export const getPatientInfoById = async (id) => {
    let result = await client.get('/users/patient/'+id);
    return result;
}

export const updatePatientInfo = async (id, address, date_of_birth) => {
    let response = await client.post('/users/patient/'+id,
    {
        address: address,
        date_of_birth: date_of_birth
    });
    console.log(response);
    return response;
}

export const getAllPatients = async () => {
    let result = await client.get('/users/patients');
    return result;
}
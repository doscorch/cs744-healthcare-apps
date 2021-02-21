
import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

const users = {};
// call api to register user
export const registerUser = async (username, password, firstName, lastName,
    user_type, security_answer_1, security_answer_2, security_answer_3,
    security_question_1, security_question_2, security_question_3,
    address, date_of_birth, license_number) => {
    return await users.create({ "username": username, "password": password, "firstName": firstName, "lastName": lastName, userRole: "patient" }, {});
}

// call api to get users
export const getUsers = async () => {
    return users.find().then(u => u.data)
}

//call api to check security question answer
export const answerSecurityQuestion = async (user, question_id, answer, attempt) => {
    client.post(`/question`, 
    {
        user: user,
        question_id: question_id,
        answer: answer,
        attempt: attempt
    }).then(success => {
        return success;
    });
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
    return await users.update(user._id, user, {});
}

// call api to patch user
export const patchUser = async (userPartial) => {
    return await users.patch(userPartial._id, userPartial, {})
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
                    msg: null,
                }
            })
        }
    } catch (error) {
        console.log(error);
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

